'use strict';

var browserify = require('browserify');
var babelify = require("babelify");
var partialify = require('partialify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var concat_json = require("gulp-concat-json");

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

gulp.task('workshops', function () {
  return gulp.src('./workshops/*.json')
    .pipe(concat_json("bundled-workshops.json"))
    .pipe(gulp.dest("./static/js/src"));
});

gulp.task('bundle', function() {
  return browserify({
      entries: [
        './static/js/src/app.js'
      ],
      debug: true,
      cache: { },
      packageCache: { },
      fullPaths: true
    })
    .transform(partialify)
    .transform(babelify)
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./static/js/dest'));
});

gulp.task('watch', function() {

  gulp.start('workshops');
  watch(['./workshops/*.json'], function() {
    gulp.start('workshops');
  });

  gulp.start('bundle');
  watch(['./static/js/src/**/*.js', './static/js/src/**/*.html'], function() {
    gulp.start('bundle');
  });
  
});

gulp.task('default', ['icons', 'staticlibs', 'workshops', 'bundle']);
