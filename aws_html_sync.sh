#!/bin/bash
aws s3 sync ./deploy s3://www.dwellingofduels.net --delete --cache-control max-age=604800