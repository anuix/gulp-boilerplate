'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const minifyCSS = require('gulp-csso');


/* ------------------------------------------
 * Global Variables
 --------------------------------------------*/
const dirs = {
  src: './webroot__dev',
  dest: './webroot'
};

var paths = {
  styles: {
    src: `${dirs.src}/scss/app.scss`,
    dest: `${dirs.dest}/css/`,
    wildcard: `${dirs.src}/scss/**/*.scss`
  },
  scripts: {
    src: `${dirs.src}/js/app.js`,
    dest: `${dirs.dest}/js/`,
    wildcard: `${dirs.src}/js/**/*.js`,
    dir: `${dirs.src}/js/`
  },
  images__styles: {
    src: `${dirs.src}/scss/img/**/*.*`,
    dest: `${dirs.dest}/css/img`,
  },
  images: {
    src: `${dirs.src}/img/**/*.*`,
    dest: `${dirs.dest}/img`,
  },
};





/* ------------------------------------------
 * Tasks > SCSS
 --------------------------------------------*/
const css = () => {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(minifyCSS())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}



/* ------------------------------------------
 * Tasks > SCSS > images
 --------------------------------------------*/
 const css__images = () => {
   return gulp.src(paths.images__styles.src)
     .pipe(gulp.dest(paths.images__styles.dest))
 }


/* ------------------------------------------
 * JS task
 --------------------------------------------*/
const js = () => {
  let b = browserify({
    entries: paths.scripts.src,
    debug: true,
    paths: [paths.scripts.dir],
    extensions: ['es6'],
  });

  return b.bundle()
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest))
}


/* ------------------------------------------
 * Tasks > SCSS > images
 --------------------------------------------*/
 const images = () => {
   return gulp.src(paths.images.src)
     .pipe(gulp.dest(paths.images.dest))
 }



  /* ------------------------------------------
  * Defining tasks
  --------------------------------------------*/
 gulp.task('css', css);
 gulp.task('css__images', css__images);
 gulp.task('js', js);
 gulp.task('images', js);






 /* ------------------------------------------
  * DEV task
  --------------------------------------------*/
 gulp.task('dev', gulp.series('css', 'js', 'css__images', 'images', function (done) {
   done();
 }));
