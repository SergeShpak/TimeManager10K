/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    mainBowerFiles = require("main-bower-files"),
    filter = require("gulp-filter"),
    gutil = require("gulp-util"),
    less = require("gulp-less"),
    rename = require("gulp-rename");

var webroot = "./wwwroot/";

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
    bowerJsDest: webroot + "js/bower.min.js",
    bootstrapCssDest: webroot + "css"
};

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("bower:js", function() {
    return gulp.src(mainBowerFiles())
        .pipe(filter("**/*.js"))
        .pipe(concat(paths.bowerJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("bower:bootstrapLess", function() {
    return gulp.src(mainBowerFiles())
        .pipe(filter("**/bootstrap.less"))
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(paths.bootstrapCssDest))
});

gulp.task("bower", ["bower:js", "bower:bootstrapLess"]);
