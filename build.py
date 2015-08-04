#!/usr/bin/env python3

import os
import sys
import jinja2
import shutil
import collections


OUT_DIR = 'deploy' + os.sep
TEMPLATE_DIR = 'templates' + os.sep

TEMPLATES = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_DIR))


def get_argument():
    if len(sys.argv) == 1:
        sys.exit('Missing `dodarchive` directory path. Exiting...')

    archive_dir = sys.argv[1]

    if not os.path.isdir(archive_dir):
        sys.exit('`{}` is not a directory. Exiting...'.format(archive_dir))

    return archive_dir


def build_data(archive_dir):
    data = collections.OrderedDict()

    for d in os.listdir(archive_dir):
        path = os.path.join(archive_dir, d)

        if not os.path.isdir(path):
            continue

        data[d] = get_month_data(path)

    return data


def get_month_data(month_dir):
    songs = []

    for f in [f for f in os.listdir(month_dir) if f.endswith('.mp3')]:
        songs.append(get_song_data(f))

    return songs


def get_song_data(filename):
    parts = filename.split('-')

    return {
        'rank': parts[0],
        'artist': parts[1],
        'game': parts[2],
        'title': parts[3]
    }


def build_site(data):
    try:
        shutil.rmtree(OUT_DIR)
    except OSError:
        pass

    os.mkdir(OUT_DIR)

    build_index(data)

    shutil.copytree(TEMPLATE_DIR + 'static', OUT_DIR + 'static')


def build_index(data):
    with open(OUT_DIR + 'index.html', 'w') as out:
        template = TEMPLATES.get_template('index.html')

        out.write(template.render())


if __name__ == '__main__':
    archive_dir = get_argument()

    data = build_data(archive_dir)

    build_site(data)
