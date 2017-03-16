const gulp = require('gulp');
// Plugins
const del = require('gulp-delete-file'),
      gulpIf = require('gulp-if')
      babel = require('gulp-babel');
      uglify = require('gulp-uglify');
      cleanCSS = require('gulp-clean-css');
      concat = require('gulp-concat');
      browserSync = require('browser-sync').create();

// vars

const destFolder = './docs';

// env
// Run NODE_ENV=production gulp to use production environment
const env = process.env.NODE_ENV || 'development';

// tasks

// css
gulp.task('css', () => {
  gulp.src('./src/css/*.css')
      .pipe(concat('concat.css'))
      .pipe(gulpIf(env === 'production', cleanCSS({compatibility: 'ie8'})))
      .pipe(gulp.dest(destFolder + '/css/'))
      .pipe(browserSync.stream());
});

// html
gulp.task('html', () => {
  return gulp.src('./src/index.html')
  .pipe(gulp.dest(destFolder + '/'))
  .pipe(browserSync.stream());
});

// move js
gulp.task('mv-js', () => {
  gulp.src([
        './src/js/request.js',
        './src/js/design-requests.js',
        './src/js/rating.js',
        './src/js/design.js',
        './src/js/renderer.js',
        './src/js/handler.js',
        './src/js/main.js',
        './src/js/requester.js',
      ])
      .pipe(concat('app.js'))
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(gulpIf(env === 'production', uglify()))
      .pipe(gulp.dest(destFolder + '/js/'))
      .pipe(browserSync.stream());
});

// move images
gulp.task('mv-images', () => {
  gulp.src('./src/img/*')
      .pipe(gulp.dest(destFolder + '/img/'))
      .pipe(browserSync.stream());
});

// move fonts
gulp.task('mv-fonts', () => {
  gulp.src('./src/fonts/**/*')
      .pipe(gulp.dest(destFolder + '/fonts/'))
      .pipe(browserSync.stream());
});

// move font-awesome
gulp.task('mv-font-awesome', () => {
  gulp.src('./src/font-awesome-4.7.0/**/*')
      .pipe(gulp.dest(destFolder + '/font-awesome-4.7.0'))
      .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/img/*', ['mv-images']);
  gulp.watch('./src/fonts/**/*', ['mv-fonts']);
  gulp.watch('./src/css/*.css', ['css']);
  gulp.watch('./src/js/**/*.js', ['mv-js']);
});

// browser-sync
gulp.task('serve', ['html', 'css', 'mv-images', 'mv-js', 'mv-fonts', 'mv-font-awesome', 'watch'], () => {
  browserSync.init({
    server: destFolder,
    browser: 'google chrome'
  })
})

// Default task ran if we call 'gulp'
// We use this to execute all task and then watch them
// If we need sync execution (default is async) we could use run-sequence
gulp.task('default', ['serve']);