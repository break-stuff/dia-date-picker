#!/usr/bin/env sh

# abort on errors
set -e

# build project
npm run build

# build docs
cd docs
npm run build

# navigate into the build output directory
cd src/.vuepress/dist

# if you are deploying to a custom domain
echo 'dia-date-picker.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:break-stuff/dia-date-picker.git main:gh-pages

cd ../../../..