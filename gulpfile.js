/*
 * @Author: yingyuk
 * @Date:   2016-05-09 23:33:21
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-05-10 00:02:52
 */

'use strict';
var gulp = require('gulp');
// var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var csscomb = require('gulp-csscomb');
var shorthand = require('gulp-shorthand');
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var del = require('del');
var imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');

gulp.task('useref', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.scss', csso()))
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('dist'));
});


gulp.task('html', function() {
  return gulp.src('dist/*.html')
    // html压缩
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('css', function() {
  return sass('src/styles/main.scss') // sass编译
    .on('error', sass.logError)
    // .pipe(gulp.dest('dist/styles'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })) // css前缀
    .pipe(shorthand()) // css 缩写；
    .pipe(csscomb()) // css 排序，合并；
    .pipe(csso()) // css压缩
    .pipe(gulp.dest('dist/styles/'));
  // .pipe(browserSync.reload({
  //     stream: true
  // }));
})


gulp.task('img', () => {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [
        { removeViewBox: false },
        { cleanupIDs: false }
      ],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('js', function() {
  return gulp.src('src/scripts/*.js')
    // .pipe(concat('main.js')) // 拼接
    .pipe(uglify()) // 压缩
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('font', function() {
     return gulp.src('src/fonts/*')
      .pipe(gulp.dest('dist/fonts'));
});
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('dist',function () {
	
})
