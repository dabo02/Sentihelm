var jshint = require('gulp-jshint');
var gulp   = require('gulp');

var javascriptFiles = ['./lib/*.js', './models/*.js', './routes/*.js', './bin/www', './gulpfile.js'];

gulp.task('lint', function() {
  return gulp.src(javascriptFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
