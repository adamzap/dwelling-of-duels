#!/usr/bin/env bash

set -o errexit
aws s3 sync ./dodarchive s3://dwellingofduels-static-site/dodarchive --delete --cache-control max-age=604800 --exclude "1?-??-*/*" --exclude "2?-??-*/*"

./aws_cloundfront_invalidate