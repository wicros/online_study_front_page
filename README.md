# README

## Technology

The project is based on ES2015+、vue、vuex、vue-router、element-ui.

vue2 + vuex + vue-router + webpack + ES6/7 + fetch + sass + flex + svg

## Development

Note:This project used a lot of properties such as ES6+, so node 6.0.0+ is required

```
git clone https://github.com/linc-info/linc_study_front_page.git

cd linc_study_front_page

npm install

npm run dev
```

## Update packages

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g npm webpack webpack-cli
```

```sh
$ node --version && npm --version && webpack --version
v10.7.0
6.2.0
4.16.2
```

Related issue https://github.com/linc-info/linc_study_front_page/issues/10

## Features

* [x] Project base environment
* [x] Home page has been completed
* [x] Login and register page has been completed
* [x] The breadcrumb are finished in the class details page
* [x] Class details page has been completed
* [x] All courses page has been completed
* [x] Course details page has been completed
* [x] Course details popup has been completed

## Layout

```
├── dist                        // webpack builds the output file
├── favicon.ico                 // icon
├── package-lock.json           // dependency package files has a version number
├── package.json                // dependency package files
├── src                         // source code directory
│   ├── App.vue                 // entry page js file
│   ├── components              // common components
│   ├── config                  // basic configuration
│   ├── images                  // public picture
│   ├── index.html              // entry page html file
│   ├── main.js                 // the main js for loading components
│   ├── pages                   // pages
│   ├── plugins                 // plugins
│   ├── router.js               // router configuration
│   ├── store                   // vuex status management
│   ├── service                 // controller service
│   └── style                   // common css
│       └── common.css          // a common css file
└── webpack.config.js           // webpack config file
```
