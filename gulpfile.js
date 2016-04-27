var gulp = require('gulp');
var p = require('gulp-load-plugins')();
var wiredep = require('wiredep');
var autoprefixer = require('autoprefixer');
var csso = require('postcss-csso');
var bs = require('browser-sync');
var mock = require('json-mock');

var path = {
  html: ['src/**/*.html'],
  script: ['src/**/*.js'],
  style: ['src/**/*.css'],
  test: ['test/**/*.js', '!test/jasmine/**/*.js'],
  output: 'dist'
};

var bsTest;
var bsServer;

gulp.task('clean', function() {
  gulp.src(path.output).pipe(p.clean());
});

gulp.task('lint', function() {
  return gulp.src(path.script.concat(path.test))
    .pipe(p.eslint())
    .pipe(p.eslint.format());
});

gulp.task('test', function() {
  var api = mock.create();
  api.use(mock.router('test/db.json'));
  api.listen(3005);

  bsTest = bs.create('Server test');
  bsTest.init({
    ui: {port: 3003},
    server: {
      baseDir: ['test'],
      index: 'SpecRunner.html',
      routes: {
        '/lib': 'lib',
        '/src': 'src/js'
      }
    },
    port: 3002
  });

  gulp.watch(path.test.concat(path.script)).on('change', bsTest.reload);
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

gulp.task('watch', function() {
  gulp.watch(path.style).on('change', bsServer.reload);
  gulp.watch(path.script, ['lint', 'test']).on('change', bsServer.reload);
  gulp.watch(path.html).on('change', bsServer.reload);
});

gulp.task('serve', ['inject-bower'], function() {
  bsServer = bs.create('Server');
  bsServer.init({
    ui: {port: 3001},
    server: {
      baseDir: ['src'],
      index: 'index.html',
      routes: {
        '/lib': 'lib'
      }
    },
    port: 3000
  });

  gulp.watch(path.style).on('change', bsServer.reload);
  gulp.watch(path.script, ['lint']).on('change', bsServer.reload);
  gulp.watch(path.html).on('change', bsServer.reload);
});

gulp.task('default', ['serve', 'test']);
