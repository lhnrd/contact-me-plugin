var gulp = require('gulp');
var p = require('gulp-load-plugins')();
var wiredep = require('wiredep');
var autoprefixer = require('autoprefixer');
var csso = require('postcss-csso');
var bs = require('browser-sync').create();

var path = {
  html: ['src/**/*.html'],
  script: ['src/**/*.js'],
  style: ['src/**/*.css'],
  test: ['test/**/*.js'],
  output: 'dist'
};

gulp.task('clean', function() {
  gulp.src(path.output).pipe(p.clean());
});

gulp.task('lint', function() {
  return gulp.src(path.script)
    .pipe(p.eslint())
    .pipe(p.eslint.format())
    .pipe(p.eslint.failAfterError());
});

gulp.task('test', function() {
  return gulp.src(path.test)
    .pipe(p.jasmine())
    .on('error', p.notify.onError({
      title: 'Jasmine Test Failed',
      message: 'One or more tests failed, see the cli for details.'
    }));
});

gulp.task('inject-bower', function() {
  return gulp.src(path.html)
    .pipe(wiredep.stream())
    .pipe(gulp.dest('src'));
});

gulp.task('build', function() {
  // build standalone plugin
  gulp.src(path.script)
    .pipe(p.rename({suffix: '.standalone'}))
    .pipe(p.uglify())
    .pipe(gulp.dest(path.output));

  // build plugin with all its dependencies
  gulp.src(wiredep().js.concat(path.script))
    .pipe(p.concat('js/contact-me.js'))
    .pipe(p.uglify())
    .pipe(gulp.dest(path.output));

  // build standalone style
  gulp.src(path.style)
    .pipe(p.rename({suffix: '.standalone'}))
    .pipe(p.postcss([
      autoprefixer({browsers: ['last 1 version']}),
      csso
    ]))
    .pipe(gulp.dest(path.output));

  // build style with all its dependencies
  gulp.src(wiredep().css.concat(path.style))
    .pipe(p.concat('css/contact-me.css'))
    .pipe(p.postcss([
      autoprefixer({browsers: ['last 1 version']}),
      csso
    ]))
    .pipe(gulp.dest(path.output));
});

gulp.task('serve', ['inject-bower'], function() {
  bs.init({
    server: {
      baseDir: ['src'],
      index: 'index.html',
      routes: {
        '/lib': 'lib'
      }
    }
  });

  gulp.watch(path.style).on('change', bs.reload);
  gulp.watch(path.script, ['lint', 'test']).on('change', bs.reload);
  gulp.watch(path.html).on('change', bs.reload);
});
