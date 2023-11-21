var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    lec = require('gulp-line-ending-corrector'),
    pkg = require('./package.json');

function minifyjs() {
    return gulp.src(["src/jquery.validate.unobtrusive.js"])
        .pipe(replace(/@version.*/, '@version v' + pkg.version))
        .pipe(gulp.dest("dist"))
        .pipe(uglify({
            mangle: true,
            output: {
                comments: "some"
            }
        }))
        .pipe(lec({ eolc: 'CRLF' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist"));
}

exports.default = minifyjs;