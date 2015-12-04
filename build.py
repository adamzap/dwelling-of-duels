#!/usr/bin/env python3

import os
import re
import sys
import jinja2
import shutil
import calendar
import datetime
import markdown
import collections
import configparser

from slugify import slugify
from hsaudiotag import id3v2, auto as parse_id3


id3v2.re_numeric_genre = re.compile('always-fail')

HREF_RE = re.compile(r'(href="/.+/)"')

OUT_DIR = 'deploy' + os.sep
TEMPLATE_DIR = 'templates' + os.sep

TEMPLATES = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_DIR))

TEMPLATES.filters['slugify'] = slugify

CONFIG = configparser.ConfigParser()
CONFIG.read('site.cfg')

VOTING = CONFIG['dod_site'].getboolean('voting')
ARCHIVE_DIR = CONFIG['dod_site'].get('archive_dir')

DATA = []

DUEL_REPLACEMENTS = [
    ('DoD04-CW', 'DoD04-10'),
    ('DoD05-JO', 'DoD05-07'),
    ('DoD05-TS', 'DoD05-02'),
    ('DoD06-JO', 'DoD06-01'),
    ('DoD06-TS', 'DoD06-02'),
    ('DoD09-JO', 'DoD09-01'),
    ('DoD10-JO', 'DoD10-01'),
    ('DoD11-11S', 'DoD11-11'),
    ('DoD13-0910', 'DoD13-09')
]

ARTIST_WHITELIST = [
    'Evil(I)(I)'
]


def build_data():
    for d in os.listdir(ARCHIVE_DIR):
        path = os.path.join(ARCHIVE_DIR, d)

        if not os.path.isdir(path):
            continue

        DATA.extend(get_month_data(path))

    set_template_globals()


def fix_duel_name(duel):
    for x, y in DUEL_REPLACEMENTS:
        duel = duel.replace(x, y)

    return duel


def fix_artist(artist):
    if artist not in ARTIST_WHITELIST:
        artist = artist.replace(' (', ', ').replace(')', '')

    return artist


def get_month_data(month_dir):
    songs = []

    month_files = os.listdir(month_dir)

    song_filenames = [f for f in month_files if f.endswith('.mp3')]

    max_rank = len([f for f in song_filenames if not f.startswith('ZZ')])

    for f in song_filenames:
        song_path = os.path.join(month_dir, f)

        song_data = parse_id3.File(song_path)

        duel = fix_duel_name(song_data.album).replace('DoD', '', 1)

        month_number = duel.split('-')[1].split(':')[0]

        artist = fix_artist(song_data.artist)

        month_dir_part = month_dir.replace(ARCHIVE_DIR, '').strip(os.sep)

        songs.append({
            'rank': f.split('-')[0].replace('tie', ''),
            'max_rank': max_rank,
            'artists': artist.split(', '),
            'multiple_artists': len(artist.split(', ')) > 1,
            'games': song_data.genre.split(', '),
            'multiple_games': len(song_data.genre.split(', ')) > 1,
            'title': song_data.title,
            'duration': song_data.duration,
            'duel': duel,
            'link': os.sep + song_path,
            'theme': duel.split(': ', 1)[1],
            'year': '20' + duel.split('-')[0],
            'month': month_number,
            'month_name': calendar.month_name[int(month_number)],
            'month_dir': month_dir_part,
            'has_log': month_dir_part + '.log' in month_files,
            'has_banner': month_dir_part + '.jpg' in month_files,
            'has_archive': month_dir_part + '.zip' in month_files
        })

    return songs


def parse_artist_links():
    lines = open('artist-links.csv').read().strip().split('\n')

    return {a: l for a, l in [x.split(', ') for x in lines]}


def set_template_globals():
    TEMPLATES.globals['voting'] = VOTING
    TEMPLATES.globals['archive_dir'] = ARCHIVE_DIR
    TEMPLATES.globals['artist_links'] = parse_artist_links()

    latest_month = DATA[-1]['month_dir']

    if VOTING:
        _d = lambda d: d['month_dir']

        winners_month = [_d(d) for d in DATA if _d(d) != latest_month][-1]
    else:
        winners_month = latest_month

    winners = [s for s in DATA if s['month_dir'] == winners_month]
    winners.sort(key=lambda s: s['rank'])

    TEMPLATES.globals['latest_duel'] = DATA[-1]['duel']
    TEMPLATES.globals['latest_month'] = latest_month
    TEMPLATES.globals['latest_winners'] = winners

    start_delta = datetime.date.today() - datetime.date(2003, 9, 1)

    TEMPLATES.globals['stats'] = {
        'songs': len(DATA),
        'hours': sum([s['duration'] for s in DATA]) / 60 / 60,
        'years': start_delta.days / 365
    }


def build_site():
    try:
        shutil.rmtree(OUT_DIR)
    except OSError:
        pass

    os.mkdir(OUT_DIR)

    build_pages('duels')
    build_pages('games')
    build_pages('artists')

    build_index()

    write_page('rules', {})
    write_page('voting', {})

    shutil.copytree(TEMPLATE_DIR + 'static', OUT_DIR + 'static')


def build_pages(kind):
    os.mkdir(os.path.join(OUT_DIR, kind))

    song_lists = collections.defaultdict(list)

    field = kind if kind in DATA[0] else kind.rstrip('s')

    for song in DATA:
        if type(song[field]) is not list:
            song_lists[song[field]].append(song)
        else:
            for key in song[kind]:
                song_lists[key].append(song)

    for key, song_list in song_lists.items():
        path = os.path.join(kind, slugify(key))

        write_page(kind.rstrip('s'), {'key': key, 'objs': song_list}, path)

    TEMPLATES.globals['stats'][kind] = len(song_lists)

    write_page(kind, {'objs': song_lists})


def build_index():
    raw_content = open('front-page.md').read()

    content = markdown.markdown(raw_content)

    write_page('index', {'the_content': content}, '')


def write_page(template_name, context, path=None):
    if path is None:
        path = template_name

    dir_path = os.path.join(OUT_DIR, path)

    if not os.path.isdir(dir_path):
        os.mkdir(dir_path)

    out_path = os.path.join(dir_path, 'index.html')

    template = TEMPLATES.get_template(template_name + '.html')

    with open(out_path, 'w') as out:
        html = template.render(context)

        if 'test' in sys.argv:
            test_path = os.path.join(os.getcwd(), 'deploy')

            html = html.replace('href="/', 'href="%s/' % test_path)
            html = html.replace('src="/', 'src="%s/' % test_path)

            html = HREF_RE.sub(r'\1index.html"', html)

        out.write(html)


def build():
    build_data()
    build_site()


if __name__ == '__main__':
    if not os.path.isdir(ARCHIVE_DIR):
        sys.exit('Error: `{}` must be in {}'.format(ARCHIVE_DIR, os.getcwd()))

    build()
