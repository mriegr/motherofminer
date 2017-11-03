const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('start', () => {
  nodemon({
    script: './src/server',
    ext: 'js html',
    tasks: ['lint'],
    legacyWatch: true
  });
});

gulp.task('lint', () => (
  gulp.src(['src/**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
));

gulp.task('default', ['start', 'lint']);