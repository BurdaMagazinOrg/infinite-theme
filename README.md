# Infinite

[![Total Downloads](https://poser.pugx.org/burdamagazinorg/infinite_theme/downloads?format=flat-square)](https://packagist.org/packages/burdamagazinorg/infinite_theme)
[![Monthly Downloads](https://poser.pugx.org/burdamagazinorg/infinite_theme/d/monthly?format=flat-square)](https://packagist.org/packages/burdamagazinorg/infinite_theme)
[![License](https://poser.pugx.org/burdamagazinorg/infinite_theme/license?format=flat-square)](https://packagist.org/packages/burdamagazinorg/infinite_theme)

Drupal 8 theme delivered with the [Thunder CMS](http://www.thunder.org).

**PLEASE NOTE**: This theme is not longer actively maintained and is considered deprecated.

![Theme preview](./images/infinite.png)

### Installation
1. make sure you have node with npm installed (https://nodejs.org/)
1. go to theme path in your shell: `cd docroot/themes/contrib/infinite_theme` 
2. type: `npm install` to build the theme for production use

### Development

- `gulp` build the theme for production use (this starts automatically after npm install)
- `gulp bower` runs bower update
- `gulp sass` generates compressed CSS for production use
- `gulp sass --dev` generates readable CSS with source maps
- `gulp watch` auto-builds if a change is detected in sass / templates / js and reloads the browser thanks to BrowserSync 
- `gulp watch --http://yourhost.local:8888` you can provide your URL with the command directly
- `gulp watch --http://yourhost.local:8888 --dev` you can also generate readable CSS, while watching for changes
