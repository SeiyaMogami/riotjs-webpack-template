'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const sequence = require('run-sequence');
const yargs = require('yargs').argv;
let destPath;

gulp.task('load-config', (done) => {
  process.env.NODE_ENV = yargs.env || 'dev';
  destPath = `./_dist/${process.env.NODE_ENV}`;
  done();
});

////////////////////
// build
////////////////////

const del = require('del');
const sass = require('gulp-sass');
const webpack = require('gulp-webpack');

gulp.task('clean-dest', (done) =>
  del([destPath], done)
);

gulp.task('scss', () =>
  gulp.src('./src/scss/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(`${destPath}/css`))
);

gulp.task('copy', () =>
  gulp.src('./src/static/**')
  .pipe(gulp.dest(destPath))
);

gulp.task('webpack', function() {
  return gulp.src('')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(destPath));
});

gulp.task('build', (done) =>
  sequence('load-config', 'clean-dest', 'scss', 'copy', 'webpack', done)
);

////////////////////
// deploy
////////////////////

gulp.task('upload-s3', (done) => {
  const config = require(`./config/${process.env.NODE_ENV}.json`);
  const s3 = require('gulp-s3-upload')({
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  });
  const settings = {
    Bucket: config.s3.bucketName,
    ACL: 'public-read'
  };
  return gulp.src(`${destPath}/**`)
    .pipe(s3(settings), done);
});

gulp.task('deploy', (done) =>
  sequence('build', 'upload-s3', done)
);

////////////////////
// test
////////////////////

const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

gulp.task('clean-test', (done) =>
  del(['test/.coverage', 'test/xunit.xml', 'test/.logs/*', '!test/.logs/.gitkeep'], done)
);

gulp.task('coverage-setting', () =>
  gulp.src(['src/lib/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire())
);

gulp.task('test', ['clean-test', 'coverage-setting'], () => {
  process.chdir('test');
  let testError;
  return gulp.src(['**/*.test.js', '!node_modules/**/*.js'], {
      read: false
    })
    .pipe(mocha({
        reporter: 'xunit-file',
        timeout: '5000'
      })
      .on('error', function(err) {
        testError = err;
        this.emit('end');
      }))
    .pipe(istanbul.writeReports('.coverage'))
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 70
      }
    }))
    .once('end', function() {
      if (testError) {
        gutil.log(testError.toString());
      }
      process.exit();
    });
});
