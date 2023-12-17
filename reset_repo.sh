#!/bin/bash

rm -rf .git
git init
git add .
git commit -m "First push"
git remote add origin git@github.com:alxswe/ghmrc.git
git push -u origin master -f
