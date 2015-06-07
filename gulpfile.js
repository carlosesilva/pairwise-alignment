var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: "./",
            // directory: true
        },
        open: "ui"
    });

    gulp.watch("./sass/**/*.scss", ['sass']);
    gulp.watch(["./*.html", "./js/**/*.js"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./sass/**/*.scss")
    .pipe(plumber())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
});



// Default task
gulp.task('default', ['serve']);