var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');

gulp.task('default', function() {
    return gulp.src('styles/*.css')
        .pipe(concatCss("bundle.css"))
        .pipe(minifyCss())
        .pipe(rename("bundle.min.css"))
        .pipe(gulp.dest('app/css/'))
        .pipe(notify('Css Comp Done!'));
});

gulp.task('watch', function() {
    gulp.watch('styles/*.css', ['default']);
});