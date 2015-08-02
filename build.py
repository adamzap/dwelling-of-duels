#!/usr/bin/env python3

import os
import sys
import collections


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
    pass


if __name__ == '__main__':
    archive_dir = get_argument()

    data = build_data(archive_dir)

    build_site(data)
