#!/usr/bin/env python3

import os
import re
import sys
import traceback
import jinja2
import shutil
import hashlib
import calendar
import datetime
import markdown
import functools
import collections
import configparser

from slugify import slugify
from hsaudiotag import id3v2, auto as parse_id3
from typing import List

open = functools.partial(open, encoding='utf-8')

id3v2.re_numeric_genre = re.compile('always-fail')

HREF_RE = re.compile(r'(deploy/(?:.+/)?)"')

OUT_DIR = 'deploy' + os.sep
TEMPLATE_DIR = 'templates' + os.sep

TEMPLATES = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_DIR))

SLUG_REPLACEMENTS = [["'", ""]]

slugify_cache = {}

def slugify_with_cache(key):
    if key not in slugify_cache:
        slugify_cache[key] = slugify(key, replacements=SLUG_REPLACEMENTS)
    return slugify_cache[key]

TEMPLATES.filters['slugify'] = slugify_with_cache

CONFIG = configparser.ConfigParser()
CONFIG.read('site.cfg')

VOTING = CONFIG['dod_site'].getboolean('voting')
ARCHIVE_DIR = CONFIG['dod_site'].get('archive_dir')
ARCHIVE_URL = CONFIG['dod_site'].get('archive_url')
DEADLINE_TIME = CONFIG['dod_site'].get('deadline_time')
LATEST_MONTH_OVERRIDE = CONFIG['dod_site'].get('latest_month_override')
WINNERS_MONTH_OVERRIDE = CONFIG['dod_site'].get('winners_month_override')

DATA = []

# map of (find, replace)
DUEL_REPLACEMENTS = [
    ('DoD04-CW', 'DoD04-10'),
    ('DoD05-JO', 'DoD05-07'),
    ('DoD05-TS', 'DoD05-02'),
    ('DoD06-JO', 'DoD06-01'),
    ('DoD06-TS', 'DoD06-02'),
    ('DoD09-JO', 'DoD09-01'),
    ('DoD10-JO', 'DoD10-01'),
    ('DoD11-11S', 'DoD11-11'),
    ('DoD13-0910', 'DoD13-09'),
    ('DoD19-TS', 'DoD19-09')
]

MONTH_REPLACEMENTS = [
    #('19-TS-TornadoOfSolos', '19-09-TornadoOfSolos')
]

# the generator uses parentheses as delimiters, use this to whitelist an artist name from the delimiting
ARTIST_WHITELIST = [
    'Evil(I)(I)',
    'Pokérus Project (Live!)',
    'Oded (Dedi) Ben-Isaac',
    'Misty (the cat)'
]

# the generator uses commas as delimiters, use this to whitelist a game name from the delimiting
GAME_WHITELIST = [
    'Hey You, Pikachu!',
    "Flower, Sun, and Rain"
]

CSS_FILES = [
    'bootstrap.css',
    'sortable.css',
    'slider.css',
    'style.css',
	'nanoscroller.css',
    'other.css'
]

JS_FILES = [s.replace('/', os.sep) for s in [
    'lib/jquery.js',
	'lib/jquery.nanoscroller.min.js',
	'lib/jquery.floatThead.min.js',
    'lib/bootstrap-transition.js',
    'lib/bootstrap-collapse.js',
    'lib/sortable.js',
    'lib/slider.js',
	'lib/howler.min.js',
    'make-filter.js',
    'player.js',
    'voting.js',
	'randomPlayer.js'
]]

def build_data():
    numberOfFolders = len(os.listdir(ARCHIVE_DIR))
    currentFolderCount = 0
    quarterCount = numberOfFolders / 4
    quarter = False
    half = False
    threeQuarters = False
    full = False

    for d in os.listdir(ARCHIVE_DIR):
        currentFolderCount = currentFolderCount + 1
        if currentFolderCount > quarterCount and quarter is False:
            quarter = True
            print("25%...", end='', flush=True)
        if currentFolderCount > quarterCount*2 and half is False:
            half = True
            print("50%...", end='', flush=True)
        if currentFolderCount > quarterCount*3 and threeQuarters is False:
            threeQuarters = True
            print("75%...", end='', flush=True)
        if currentFolderCount >= numberOfFolders and full is False:
            full = True
            print("100%")
        path = os.path.join(ARCHIVE_DIR, d)

        if not os.path.isdir(path):
            continue

        DATA.extend(get_month_data(path))

    set_template_globals()


def fix_duel_name(duel):
    for find, replace in DUEL_REPLACEMENTS:
        duel = duel.replace(find, replace)

    return duel


def fix_month_dir(month_dir):
    for x, y in MONTH_REPLACEMENTS:
        month_dir = month_dir.replace(x, y)

    return month_dir


def fix_artist(artist):
    for whitelist_val in ARTIST_WHITELIST:
        if whitelist_val in artist:
            return artist

    artist = artist.replace(' (', ', ').replace(')', '')

    return artist


def split_games(genre: str) -> List[str]:
    allGames = []
    for whitelist_val in GAME_WHITELIST:
        if whitelist_val in genre:
            allGames.append(whitelist_val)
            genre = genre.replace(whitelist_val, '')
            genre = genre.replace(' ,', '')
            genre = genre.lstrip(', ')
            genre = genre.rstrip(', ')

    if len(genre) == 0:
        return allGames

    rest = genre.split(', ')
    allGames.extend(rest)
    return allGames


def get_month_data(month_dir):
    songs = []

    month_files = os.listdir(month_dir)

    song_filenames = [f for f in month_files if f.endswith('.mp3')]

    max_rank = max([f.split("-")[0] for f in song_filenames if not f.startswith('ZZ')], default=0)

    youtube_link = get_youtube_link(month_dir)

    month_dir_part = month_dir.replace(ARCHIVE_DIR, '').strip(os.sep)

    month_dir_replaced = fix_month_dir(month_dir_part)

    banner_jpg = (month_dir_part + '.jpg' in month_files)
    banner_gif = (month_dir_part + '.gif' in month_files)

    for song_filename in song_filenames:

        try:
            song_path = os.path.join(month_dir, song_filename)
            song_path_part = os.path.join(month_dir_part, song_filename)

            song_data = parse_id3.File(song_path)

            duel = fix_duel_name(song_data.album).replace('DoD', '', 1)

            month_number = duel.split('-')[1].split(':')[0]

            artist = fix_artist(song_data.artist)

            games = split_games(song_data.genre)

            songs.append({
                'rank': song_filename.split('-')[0].replace('tie', ''),
                'max_rank': max_rank,
                'artists': artist.split(', '),
                'multiple_artists': len(artist.split(', ')) > 1,
                'games': games,
                'multiple_games': len(games) > 1,
                'title': song_data.title,
                'duration': song_data.duration,
                'duel': duel,
                'link': '/' + song_path_part.replace('\\', '/'),
                'theme': duel.split(': ', 1)[1],
                'year': '20' + duel.split('-')[0],
                'month': month_number,
                'month_name': calendar.month_name[int(month_number)],
                'month_dir': month_dir_replaced,
                'has_log': month_dir_part + '.log' in month_files,
                'has_banner': banner_jpg or banner_gif,
                'has_lyrics': 'lyrics.txt' in month_files,
                'banner_jpg': banner_jpg,
                'banner_gif': banner_gif,
                'has_archive': month_dir_part + '.zip' in month_files,
                'youtube_link': youtube_link,
                'id': hashlib.md5((song_data.title+song_data.genre.split(', ')[0]+duel).encode()).hexdigest()[:10]
            })
        except BaseException as err:
            print("error handling {0}: {1}".format(song_filename, err))
            traceback.print_exc()
            quit()

    return songs


def get_youtube_link(month_dir):
    path = os.path.join(month_dir, 'youtube.txt')

    return open(path).read().strip() if os.path.isfile(path) else ''


def parse_artist_links():
    lines = open('artist-links.csv').read().strip().split('\n')

    return {a: l for a, l in [x.split(', ') for x in lines]}

def parse_banner_artist_links():
    lines = open('banner-artist-links.csv').read().strip().split('\n')

    return {a: l for a, l in [x.split(', ') for x in lines]}


def get_deadline_date():
    val = CONFIG['dod_site'].get('deadline_date')

    try:
        date = datetime.date(*[int(x) for x in val.split('-')])
    except (AttributeError, TypeError, ValueError):
        s = 'Error: deadline_date must be of the form YYYY-MM-DD in site.cfg'

        sys.exit(s)

    return date


def set_template_globals():
    TEMPLATES.globals['voting'] = VOTING
    TEMPLATES.globals['deadline_date'] = get_deadline_date()
    TEMPLATES.globals['deadline_time'] = DEADLINE_TIME
    # TEMPLATES.globals['archive_dir'] = ARCHIVE_DIR
    TEMPLATES.globals['archive_url'] = ARCHIVE_URL
    TEMPLATES.globals['artist_links'] = parse_artist_links()
    TEMPLATES.globals['banner_artist_links'] = parse_banner_artist_links()

    #sort DATA by month name so we always get the actual latest month
    DATA.sort(key=lambda x: x['month_dir'])

    if LATEST_MONTH_OVERRIDE:
        latest_month = LATEST_MONTH_OVERRIDE
        print("latest_month_override: " + LATEST_MONTH_OVERRIDE)
        TEMPLATES.globals['latest_duel'] = [s for s in DATA if s['month_dir'] == latest_month][0]['duel']
    else:
        latest_month = DATA[-1]['month_dir']
        TEMPLATES.globals['latest_duel'] = DATA[-1]['duel']

    if VOTING:
        _d = lambda d: d['month_dir']

        winners_month = [_d(d) for d in DATA if _d(d) != latest_month][-1]
    else:
        winners_month = latest_month

    if WINNERS_MONTH_OVERRIDE:
        winners_month = WINNERS_MONTH_OVERRIDE
        print("winners_month_override: " + WINNERS_MONTH_OVERRIDE)

    winners = [s for s in DATA if s['month_dir'] == winners_month]
    winners.sort(key=lambda s: s['rank'])

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

    print("css and js...")
    build_static()

    print("duels...")
    build_pages('duels')
    print("games...")
    build_pages('games')
    print("artists...")
    build_pages('artists')
    print("audio player...")
    build_random()

    print("index...")
    build_index()

    print("misc...")
    write_page('rules', {})
    write_page('faq', {})
    write_page('voting', {})
    write_page('submit', {})
    write_page('404', {}, '', '404.html')


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

    dupeCheckDict = collections.defaultdict()

    for key, song_list in song_lists.items():
        
        #loop over all keys we've gone through and compare slugs
        for key2, val in dupeCheckDict.items():
            if slugify_with_cache(key) == slugify_with_cache(key2):
                print("dupe detected: {} vs {} \n  {}\n  {}".format(key, key2, song_list, val))
            
        dupeCheckDict[key] = song_list

        path = os.path.join(kind, slugify_with_cache(key))

        write_page(kind.rstrip('s'), {'key': key, 'objs': song_list}, path)

    TEMPLATES.globals['stats'][kind] = len(song_lists)

    write_page(kind, {'objs': song_lists})

def build_random():
    os.mkdir(os.path.join(OUT_DIR, 'player'))
    song_lists = collections.defaultdict(list)
    write_page('random', {'objs': DATA}, 'player')

def build_index():
    raw_content = open('front-page.md').read()

    content = markdown.markdown(raw_content)

    write_page('index', {'the_content': content}, '')


def write_page(template_name, context, path=None, name=None):
    if path is None:
        path = template_name

    if name is None:
        name = 'index.html'

    dir_path = os.path.join(OUT_DIR, path)

    if not os.path.isdir(dir_path):
        os.mkdir(dir_path)

    out_path = os.path.join(dir_path, name)

    template = TEMPLATES.get_template(template_name + '.html')

    #get image for metadata if this is a duel
    if template_name == 'duel':
        context['metaImage'] = True

    with open(out_path, 'w') as out:
        html = template.render(context)

        if 'test' in sys.argv:
            test_path = os.path.join(os.getcwd(), 'deploy')

            html = html.replace('href="/', 'href="%s/' % test_path)
            html = html.replace('src="/', 'src="%s/' % test_path)

            html = HREF_RE.sub(r'\1index.html"', html)

        out.write(html)


def build_static():
    os.mkdir(OUT_DIR + 'static')

    images_dir = 'static' + os.sep + 'img'

    shutil.copytree(TEMPLATE_DIR + images_dir, OUT_DIR + images_dir)

    write_asset(CSS_FILES, 'css')
    write_asset(JS_FILES, 'js')


def write_asset(files, extension):
    static_path = OUT_DIR + 'static' + os.sep

    combined = combine_files(files, extension)

    the_hash = hashlib.md5(combined.encode()).hexdigest()

    path = static_path + 'dod.{}.{}'.format(the_hash, extension)

    TEMPLATES.globals[extension + '_hash'] = the_hash

    with open(path, 'w') as f:
        f.write(combined)


def combine_files(files, static_prefix):
    def get_dir(f):
        return os.path.join(TEMPLATE_DIR, 'static', static_prefix, f)

    return '\n'.join([open(get_dir(f)).read() for f in files])


def build():
    print("reading metadata from MP3 files...")
    build_data()
    print("generating static site pages...")
    build_site()


if __name__ == '__main__':
    if not os.path.isdir(ARCHIVE_DIR):
        sys.exit('Error: `{}` must be in {}'.format(ARCHIVE_DIR, os.getcwd()))

    build()
