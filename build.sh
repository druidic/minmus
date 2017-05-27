#!/bin/bash -e

mkdir -p .build-tmp

cat src/*.js test/*.js > .build-tmp/test.js

jasmine .build-tmp/test.js

cat src/*.js | pbcopy
