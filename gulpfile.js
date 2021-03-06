const gulp = require('gulp');
const clean = require('gulp-clean');
const jasmine = require('gulp-jasmine');
const plumber = require('gulp-plumber'); //에러 핸들링
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const copy = require('gulp-copy');

const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');

const wiredep = require('wiredep').stream;
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

/* *************
 * compile
 ************* */
gulp.task('sass', function() {
  return gulp.src('styles/sass/*.scss')
  .pipe(plumber({
    errorHandler: function(err) {
      console.log(err);
    }
  }))
  .pipe(sass())
  .pipe(gulp.dest('dist/styles'));
});

/* *************
 * concat
 ************* */
gulp.task('concat', function() {
  return gulp.src('scripts/*.js')
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist/scripts'));
});

/* *************
 * minify
 ************* */
gulp.task('cssmin', ['sass'], function() {
  gulp.src('dist/styles/app.css')
  .pipe(cssmin())
  .pipe(gulp.dest('dist/styles'));
});

gulp.task('uglify', ['concat'], function() {
  gulp.src('dist/scripts/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/scripts'));
});

/* *************
 * copy
 ************* */
gulp.task('copy-html', function() {
  return gulp.src('index.html')
  .pipe(copy('dist'));
});

/* *************
 * Inject
 ************* */
const injectSources = gulp.src(['dist/styles/app.css', 'dist/scripts/app.js'], {read: false});

gulp.task('inject-dev', ['bower-dev', 'sass', 'concat'], function() {
  return gulp.src('index.html')
  .pipe(inject(injectSources, {relative: true}))
  .pipe(gulp.dest('./'));
});

gulp.task('inject-prod', ['bower-prod', 'cssmin', 'uglify'], function() {
  return gulp.src('dist/index.html')
  .pipe(inject(injectSources, {relative: true}))
  .pipe(gulp.dest('dist'));
});

/* *************
 * Inject Bower
 ************* */
gulp.task('bower-dev', function() {
  return gulp.src('index.html')
  .pipe(wiredep())
  .pipe(gulp.dest('./'));
});

gulp.task('bower-prod', function() {
  return gulp.src('dist/index.html')
  .pipe(wiredep())
  .pipe(gulp.dest('dist'));
});

/* *************
 * watch
 ************* */
gulp.task('script-watch', ['concat'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('sass-watch', ['sass'], function(done) {
  browserSync.reload();
  done();
});

/* *************
 * TASK
 ************* */
gulp.task('default', ['sass']);

gulp.task('test', function() {
  return gulp.src('spec/text.spec.js')
  .pipe(jasmine());
})

gulp.task('watch', function() {
  gulp.watch('styles/sass/*.scss', ['sass']);
});

// #serve
// 1. inject bower files to index.html
// 2. compile sass
// 3. concat javascripts
// 4. inject css, js to index.html
gulp.task('serve', ['inject-dev'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch('styles/sass/*.scss', ['sass-watch']);
  gulp.watch('scripts/*.js', ['script-watch']);
});

// #build
// 1. copy index.html to dist
// 2. inject bower files to index.html
// 3. cssmin
// 4. uglify
// 5. inject css, js to index.html
gulp.task('build', ['copy-html', 'inject-prod'])
