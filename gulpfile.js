'use strict';

var browserify = require('browserify');
var es6ify = require('es6ify');
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

gulp.task('blockly', function () {
  return gulp.src([
      './node_modules/blockly/**',
    ])
    .pipe(gulp.dest('./static/vendor/blockly'))
    .on('error', console.log);
});

gulp.task('bootstrap', function() {
    return gulp.src([
        './node_modules/bootstrap/dist/**'
    ])
    .pipe(gulp.dest('./static/vendor/bootstrap/dist/'))
    .on('error', console.log);
});

gulp.task('fonts', function() {
   return gulp.src([
        './node_modules/font-awesome/**',
    ])
    .pipe(gulp.dest('./static/vendor/font-awesome/'))
    .on('error', console.log);
});

gulp.task('workshops', function () {
  return gulp.src('./workshops/*.json')
    .pipe(concat_json("bundled-workshops.json"))
    .pipe(gulp.dest("./static/js/src"));
});

gulp.task('boards', function () {
  return gulp.src('./boards/*.json')
    .pipe(concat_json("bundled-boards.json"))
    .pipe(gulp.dest("./static/js/src"));
});

gulp.task('vendor', function() {
  return browserify({
      entries: [
        './static/js/src/vendor.js'
      ],
      debug: false,
      cache: { },
      packageCache: { },
      fullPaths: true
    })
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('vendor.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./static/js/'));
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
    .transform(
      // Don't ES6-ify vendor files
      es6ify.configure(/\/robotnik\/static\/js\/src\/.*\.js$/)
    )
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('app.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./static/js/'));
});

gulp.task('watch', function() {

  gulp.start('vendor');
  
  gulp.start('workshops');
  watch(['./workshops/*.json'], function() {
    gulp.start('workshops');
  });

  gulp.start('boards');
  watch(['./boards/*.json'], function() {
    gulp.start('boards');
  });

  gulp.start('bundle');
  watch(['./static/js/src/**/*.js', './static/js/src/**/*.html'], function() {
    gulp.start('bundle');
  });

});

gulp.task('default', ['icons', 'blockly', 'bootstrap', 'fonts', 'boards', 'workshops', 'vendor', 'bundle']);
