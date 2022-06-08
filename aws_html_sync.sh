#!/bin/bash
aws s3 sync ./deploy s3://www.dwellingofduels.net --delete --size-only --cache-control max-age=604800