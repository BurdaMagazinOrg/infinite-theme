/**
 * Project based environment variables
 * @type {string}
 */
var domain_bs	= 'http://thunder.dev:8888'; // @todo: think about better solution
var port_bs		= 8888; // @todo: think about better solution

var gulp		= require('gulp'),
    bower		= require('gulp-bower'),
    sequence	= require('gulp-sequence'),
    concat		= require('gulp-concat'),
    sass		= require('gulp-sass'),
    sourcemaps	= require('gulp-sourcemaps'),
    prefixer	= require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

gulp.task('bower', function()
{
    return bower({
        cmd: 'update',
        interactive: true
    });
});

gulp.task('copy-fonts', function ()
{
    return gulp.src(["./bower_components/ionicons/fonts/*"])
        .pipe(gulp.dest('./fonts/ionicons'));
});

gulp.task('sass', function ()
{
    return gulp.src('./sass/infinite-global.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(prefixer({
            browsers: ['last 3 versions', 'IE 9'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(concat('infinite-global.css'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function ()
{
    browserSync.init({
        proxy: domain_bs,
        port: port_bs
    });

    gulp.watch('./sass/**.s+(a|c)ss', ['sass'])
        .on('change', browserSync.reload);

    gulp.watch('./js/**.js')
        .on('change', browserSync.reload);

    // basic shared tpls
    gulp.watch('./templates/**.html.twig')
        .on('change', browserSync.reload);
});

gulp.task('default', function(callback)
{
    sequence('bower', 'copy-fonts', 'sass')(callback)
});