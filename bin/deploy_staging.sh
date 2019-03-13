#!/bin/bash

app=linc_study_front_page
dir=/var/www
app_path=${dir}/${app}

if [ ! -d $app_path ]; then
  git clone git@github.com:linc-info/${app}.git ${dir}
fi

cd ${app_path}
git checkout .
git pull origin staging
npm install
webpack -p
