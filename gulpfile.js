const gulp = require('gulp')
    ,sass = require('gulp-sass')

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'))
})

gulp.task('default', ['sass'], function () {
    gulp.watch(['./src/sass/print.scss'], ['sass'])
})