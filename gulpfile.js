'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var bundler = browserify({
  entries: [
    './static/js/robotnik.js'
  ],
  debug: true,
  cache: { },
  packageCache: { },
  fullPaths: true
});

gulp.task('icons', function () {
  return gulp.src([
      './static/js/bower_components/font-awesome/fonts/**.*',
      './static/js/bower_components/bootstrap/fonts/**.*'
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
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./static/js'));
});

gulp.task('default', ['icons', 'staticlibs', 'bundle']);
