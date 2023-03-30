#!/usr/bin/env bash

set -o errexit
aws cloudfront create-invalidation --distribution-id=E1VLCEEPT618YJ --paths="/*"