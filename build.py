#!/usr/bin/env python3

import os
import sys
import jinja2
import shutil
import calendar
import itertools
import livereload
import collections

from slugify import slugify
from hsaudiotag import auto as parse_id3


ARCHIVE_DIR = 'dodarchive'
OUT_DIR = 'deploy' + os.sep
TEMPLATE_DIR = 'templates' + os.sep

TEMPLATES = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_DIR))

TEMPLATES.filters['slugify'] = slugify

DATA = collections.OrderedDict()


def build_data():
    for d in os.listdir(ARCHIVE_DIR):
        path = os.path.join(ARCHIVE_DIR, d)

        if not os.path.isdir(path):
            continue

        DATA[d] = get_month_data(path)


def get_month_data(month_dir):
    songs = []

    for f in [f for f in os.listdir(month_dir) if f.endswith('.mp3')]:
        song_path = os.path.join(month_dir, f)

        song_data = parse_id3.File(song_path)

        songs.append({
            'rank': f.split('-')[0],
            'artist': song_data.artist,
            'game': song_data.genre,
            'title': song_data.title,
            'duel': song_data.album
        })

    for song in songs:
        song['max_rank'] = len(songs)

    return songs


def build_site():
    try:
        shutil.rmtree(OUT_DIR)
    except OSError:
        pass

    os.mkdir(OUT_DIR)

    build_index()
    build_duels()
    build_page_type('artist')
    build_page_type('game')

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


def build_index():
    write_page('index', {}, '')


def build_page_type(page_type):
    key_func = lambda o: o[page_type].lower()

    objs = sorted(sum(DATA.values(), []), key=key_func)

    song_lists = []

    os.mkdir(os.path.join(OUT_DIR, page_type))

    for key, songs in itertools.groupby(objs, key=key_func):
        path = os.path.join(page_type, slugify(key))

        song_list = list(songs)

        write_page(page_type, {'objs': song_list}, path)

        song_lists.append(song_list)

    write_page(page_type + 's', {'objs': song_lists})


def build_duels():
    objs = []

    os.mkdir(os.path.join(OUT_DIR, 'duel'))

    for k, v in DATA.items():
        year, month, theme = k.split('-')

        path = os.path.join('duel', slugify(k))

        write_page('duel', {'objs': v}, path)

        objs.append({
            'year': '20' + year,
            'month': calendar.month_name[int(month)],
            'theme': theme,
            'slug': slugify(k),
            'num_songs': len(v)
        })

    write_page('duels', {'objs': objs})


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
