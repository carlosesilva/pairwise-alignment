var gulp         = require('gulp');
var gutil        = require('gulp-util');
var plumber      = require('gulp-plumber');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var onError = function (err) {
    // beep on error, except when gulp-sass is being stupid and breaks because of imports
    if (err.message.indexOf('file to import not found or unreadable') < 0)
        gutil.beep();
    console.log(err.toString());
    this.emit('end');
};

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function() {

    browserSync.init({
        server: {
            baseDir: "./",
            // directory: true
        },
        open: "ui"
    });

    gulp.watch("./sass/**/*.scss", ['styles']);
    gulp.watch(["./*.html", "./js/**/*.js"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function() {
    return gulp.src("./sass/**/*.scss")
    .pipe(plumber(onError))
    .pipe(sass({ includePaths : ['./sass/partials/'] }))
    .pipe(autoprefixer())
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
});



// Default task
gulp.task('default', ['serve']);