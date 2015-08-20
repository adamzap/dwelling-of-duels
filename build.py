#!/usr/bin/env python3

import os
import sys
import jinja2
import shutil
import calendar
import datetime
import itertools
import livereload

from slugify import slugify
from hsaudiotag import auto as parse_id3


ARCHIVE_DIR = 'dodarchive'
OUT_DIR = 'deploy' + os.sep
TEMPLATE_DIR = 'templates' + os.sep

TEMPLATES = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_DIR))

TEMPLATES.filters['slugify'] = slugify

DATA = []


def build_data():
    for d in os.listdir(ARCHIVE_DIR):
        path = os.path.join(ARCHIVE_DIR, d)

        if not os.path.isdir(path):
            continue

        DATA.extend(get_month_data(path))

    set_template_globals()


def get_month_data(month_dir):
    songs = []

    song_filenames = [f for f in os.listdir(month_dir) if f.endswith('.mp3')]

    max_rank = len([f for f in song_filenames if not f.startswith('ZZ')])

    for f in song_filenames:
        song_path = os.path.join(month_dir, f)

        song_data = parse_id3.File(song_path)

        duel = song_data.album.replace('DoD', '', 1)

        songs.append({
            'rank': f.split('-')[0].replace('tie', ''),
            'max_rank': max_rank,
            'artist': song_data.artist,
            'game': song_data.genre,
            'title': song_data.title,
            'duration': song_data.duration,
            'duel': duel,
            'link': os.sep + song_path,
            'theme': duel.split(': ', 1)[1],
            'year': '20' + duel.split('-')[0],
            'month': get_month_name(duel)
        })

    return songs


def get_month_name(duel):
    month_number = int(duel.split('-')[1].split(':')[0])

    return calendar.month_name[month_number]


def set_template_globals():
    latest_duel = DATA[-1]['duel']

    winners = [s for s in DATA if s['duel'] == latest_duel]
    winners.sort(key=lambda s: s['rank'])

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

    build_page_type('duel')
    build_page_type('game')
    build_page_type('artist')

    write_page('index', {}, '')
    write_page('rules', {})

    shutil.copytree(TEMPLATE_DIR + 'static', OUT_DIR + 'static')


def write_page(template_name, context, path=None):
    if path is None:
        path = template_name

    dir_path = os.path.join(OUT_DIR, path)

    if not os.path.isdir(dir_path):
        os.mkdir(dir_path)

    out_path = os.path.join(dir_path, 'index.html')

    template = TEMPLATES.get_template(template_name + '.html')

    with open(out_path, 'w') as out:
        out.write(template.render(context))


def build_page_type(page_type):
    os.mkdir(os.path.join(OUT_DIR, page_type + 's'))

    song_lists = []

    key_func = lambda o: o[page_type].lower()

    DATA.sort(key=key_func)

    for key, songs in itertools.groupby(DATA, key=key_func):
        path = os.path.join(page_type + 's', slugify(key))

        song_list = list(songs)

        write_page(page_type, {'objs': song_list}, path)

        song_lists.append(song_list)

    TEMPLATES.globals['stats'][page_type + 's'] = len(song_lists)

    write_page(page_type + 's', {'objs': song_lists})


def build():
    build_data()
    build_site()


if __name__ == '__main__':
    if not os.path.isdir(ARCHIVE_DIR):
        sys.exit('Error: `{}` must be in {}'.format(ARCHIVE_DIR, os.getcwd()))

    build()

    if 'watch' in sys.argv:
        server = livereload.Server()

        server.watch('build.py', build)
        server.watch('dodarchive', build)
        server.watch('templates', build_site)

        server.serve(root='deploy', open_url_delay=1)
