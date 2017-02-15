# Infinite

[![Total Downloads](https://poser.pugx.org/burdamagazinorg/infinite_theme/downloads?format=flat-square)](https://packagist.org/packages/burdamagazinorg/infinite_theme)
[![Monthly Downloads](https://poser.pugx.org/burdamagazinorg/infinite_theme/d/monthly?format=flat-square)](https://packagist.org/packages/burdamagazinorg/infinite_theme)
[![License](https://poser.pugx.org/burdamagazinorg/infinite_theme/license?format=flat-square)](https://packagist.org/packages/burdamagazinorg/infinite_theme)

awesome Drupal 8 theme delivered with [Thunder CMS](http://www.thunder.org).

![Theme preview](./images/infinite.png)

### Installation

1. go to theme path in bash: `cd docroot/themes/contrib/infinite_theme` 
2. type: `npm install` for build theme for production use

### Development

- `gulp` build theme for production use (starting after npm install)
- `gulp watch` auto-builds if detected change in sass / templates / js and reload browser thanks BrowserSync 
- `gulp watch --http://yourhost.local:8888` quick way without user input
- `gulp sass --dev` generate readable CSS with source maps
- `gulp bower` just run bower.json update