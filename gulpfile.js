var gulp = require('gulp');
var path = require('path');

var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var replace = require('gulp-replace');
var packless = require('./scripts/gulp-packless');
var del = require('del');
var babel = require('gulp-babel');
var concatCss = require('gulp-concat-css');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

process.env.NODE_ENV = 'production';

gulp.task('default', ['clean'], function() {
  gulp.start('publish');
});
/**
 * 清理编译产出
 */
gulp.task('clean', function(cb) {
  del(['./lib', './dist'], cb);
});

/**
 * 编译脚本
 */
gulp.task('publish', ['compile-js', 'compile-css']);

gulp.task('compile-js', ['babel', 'clean-style']);

gulp.task('compile-css', ['copy-style-files', 'less', 'pack-less', 'pack-css', 'minify-css']);

/**
 * 使用babel对js文件进行编译；
 */
gulp.task('babel', () => {
  return gulp.src('./components/**/*.js')
    .pipe(babel({
      presets: ["es2015", "react", "stage-0"],
      plugins: ["add-module-exports", "transform-decorators-legacy", "transform-runtime"]
    }))
    .pipe(gulp.dest('lib'));
});
/**
 * 清除js文件对样式文件的引入
 */
gulp.task('clean-style', ['babel'], function() {
  return gulp.src('./lib/**/*.js')
    .pipe(replace(/require\(\'\.\/styles\.less\'\)\;/, ''))
    .pipe(gulp.dest('./lib'));
});

/**
 * 将代码库中的样式文件拷贝到发布目录；
 */
gulp.task('copy-style-files', () => {
  return gulp
    .src('./components/**/*.less')
    .pipe(gulp.dest('lib'));
});

/**
 * 对样式文件进行编译，less->css
 */
gulp.task('less', ['copy-style-files'], function () {
  return gulp.src('./lib/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }, {
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('./lib'));
});

/**
 * 生成样式映射文件
 */
gulp.task('pack-less', ['copy-style-files'], function() {
  return gulp.src('./lib/**/*.less')
    .pipe(packless('style/fivesix.css'))
    .pipe(gulp.dest('./lib'));
});

/**
 *  使用映射文件编译CSS文件
 */ 
gulp.task('pack-css', ['pack-less', 'less'], function () {
  return gulp.src('./lib/style/fivesix.css')
    .pipe(concatCss('fivesix.css'))
    .pipe(gulp.dest('dist'));
});

/**
 * 压缩CSS文件
 */
gulp.task('minify-css', ['pack-less', 'less'], function() {
  return gulp.src('./lib/style/fivesix.css')
    .pipe(cleanCss())
    .pipe(rename('fivesix.min.css'))
    .pipe(gulp.dest('dist'));
});
