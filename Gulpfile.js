'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('pre-test-istanbul', function () {
  gulp
    .src(['./index.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('unit-test-node', function () {
  gulp
    .src(['./tests/spec.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: './coverage'
    }));
});

gulp.task('tests', [
  'pre-test-istanbul',
  'unit-test-node'
]);
