var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('node-karma-wrapper');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var uglify = require('gulp-uglifyjs');

// Preconfig you server
var aKarmaTestServer = karma({
  configFile: './karma.conf.js'
});

var javascriptFiles = ['./lib/*.js', './models/*.js', './routes/*.js',
  './bin/www', './gulpfile.js',
  './src/**/*.js', './test/*[sS]pec.js'
];

gulp.task('lint', function () {
  return gulp.src(javascriptFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('test:client', function () {
  aKarmaTestServer.start();
});

gulp.task('test:server', function () {
  return gulp.src('./spec/**.js')
    .pipe(jasmine());
});

gulp.task('compile:javascript', function () {
  return gulp.src(frontEndSource)
    .pipe(uglify('sentihelm.min.js', {
      outSourceMap: true
    }))
    .pipe(gulp.dest('./public/javascript/'));
});

gulp.task('compile:css', function () {
  return gulp.src(cssSource)
    .pipe();
});

gulpt.task('compile', ['compile:javascript',
  'compile:css'
]);

gulp.task('test', ['test:sever', 'test:client']);
