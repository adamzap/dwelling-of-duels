#!/bin/bash
aws s3 sync ./dodarchive s3://dwellingofduels-static-site/dodarchive --delete --exclude "1?-??-*/*" --exclude "2?-??-*/*"