#!/bin/bash
aws s3 sync ./dodarchive s3://dwellingofduels-static-site/dodarchive --delete --cache-control max-age=604800 --exclude "0?-??-*/*" --exclude "1?-??-*/*" --exclude "20-??-*/*" --exclude "21-??-*/*"

./aws_cloudfront_invalidate.sh
