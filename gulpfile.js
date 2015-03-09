'use strict';

var browserify = require('browserify');
var es6ify = require('es6ify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var bundler = browserify({
  entries: [
    './static/js/src/robotnik.js'
  ],
  debug: true,
  cache: { },
  packageCache: { },
  fullPaths: true
});

gulp.task('icons', function () {
  return gulp.src([
      './static/vendor/font-awesome/fonts/**.*',
      './static/vendor/bootstrap/fonts/**.*'
    ])
    .pipe(gulp.dest('static/fonts'))
    .on('error', console.log);
});

gulp.task('staticlibs', function () {
  return gulp.src([
      './node_modules/blockly/**',
    ])
    .pipe(gulp.dest('./static/vendor/blockly'))
    .on('error', console.log);
});

gulp.task('bundle', function() {
  return bundler
    .add(es6ify.runtime)
    .transform(es6ify)
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./static/js/dest'));
});

gulp.task('default', ['icons', 'staticlibs', 'bundle']);
