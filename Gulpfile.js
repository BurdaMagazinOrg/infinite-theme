var gulp            = require('gulp'),
    bower           = require('gulp-bower'),
    mainBowerFiles  = require("main-bower-files"),
    sequence        = require('gulp-sequence'),
    concat          = require('gulp-concat'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    prefixer        = require('gulp-autoprefixer'),
    readlineSync    = require('readline-sync'),
    browserSync     = require('browser-sync').create();

gulp.task('bower', function()
{
    return bower();
});

gulp.task("copy-bower-files", function() {
    gulp.src(mainBowerFiles({ checkExistence: true }), { base: './bower_components' })
      .pipe(gulp.dest("./lib"))
})

gulp.task('sass', function ()
{
    if(process.argv[3] === '--' + 'dev' || process.argv[2] === 'watch')
    {
        return gulp
            .src('./sass/infinite-global.scss')
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(prefixer({
                browsers: ['last 3 versions', 'IE 9'],
                cascade: false
            }))
            .pipe(sourcemaps.write())
            .pipe(concat('infinite-global.css'))
            .pipe(gulp.dest('./css'))
            .pipe(browserSync.stream());
    }
    else
    {
        return gulp
            .src('./sass/infinite-global.scss')
            .pipe(sass({
                outputStyle: 'compressed'
            }))
            .pipe(prefixer({
                browsers: ['last 3 versions', 'IE 9'],
                cascade: false
            }))
            .pipe(concat('infinite-global.css'))
            .pipe(gulp.dest('./css'));
    }
});


gulp.task('watch', function ()
{
    browserSync.init({
        proxy: (
            process.argv[3] ?
            process.argv[3].split('--')[1] :
            readlineSync.question('Virtual host (e.g. http://thunder.dev:8888): ')
        )
    });

    gulp.watch('./sass/**', ['sass'])
        .on('change', browserSync.reload);

    gulp.watch('./js/**')
        .on('change', browserSync.reload);

    // basic shared tpls
    gulp.watch('./templates/**')
        .on('change', browserSync.reload);
});


gulp.task('default', function(callback)
{
    sequence('bower','copy-bower-files', 'sass')(callback)
});
