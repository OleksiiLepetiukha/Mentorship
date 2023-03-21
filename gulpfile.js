'use strict';

const babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    image = require('gulp-image');

const { watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

const folders = {
    src: 'src/',
    dist: './assets/'
}

const path = {
    build: {
        html: './',
        js: folders.dist + 'scripts/',
        css: folders.dist + 'styles/',
        fonts: folders.dist + 'fonts/',
        images: folders.dist + 'images/'
    },
    src: {
        html: folders.src + '*.html',
        js: folders.src + 'scripts/**/*.js',
        css: folders.src + 'styles/*.scss',
        fonts: [
            folders.src + 'fonts/**/*.*',
            'node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2'
        ],
        images: folders.src + 'images/**/*.*'
    },
    watch: {
        html: folders.src + '**/*.html',
        js: folders.src + 'scripts/**/*.js',
        css: folders.src + 'styles/**/*.scss'
    },
    clean: [folders.dist + 'scripts', folders.dist + 'styles'],
    node: 'node_modules'
};

function handleError(err) {
    console.warn(err.toString())
}

function _browserSync() {
    stylesBuild();
    scriptsBuild();
    htmlBuild();
    browserSync.init({
        server: "./"
    });
}

function stylesBuild() {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [path.src.css],
            outputStyle: 'compressed',
            sourceMap: false,
            errLogToConsole: true
        }))
        .on('error', handleError)
        .pipe(prefixer())
        .pipe(cleanCSS(
            { level: { 1: { specialComments: 0 } } }
        ))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function htmlBuild() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function scriptsBuild() {
    gulp.src(path.src.js)
        .pipe(babel())
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .on('error', handleError)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function imagesBuild() {
    gulp.src(path.src.images)
        .pipe(image({
            pngquant: true,
            jpegRecompress: false,
            mozjpeg: true,
            svgo: true,
            concurrent: 10
        }))
        .pipe(gulp.dest(path.build.images))
}

function fontsBuild() {
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
}

function build(cb) {
    // imagesBuild();
    fontsBuild();
    stylesBuild();
    scriptsBuild();
    htmlBuild();
    browserSync.reload();
    cb();
}

exports.default = function () {
    watch(path.watch.css, build);
    watch(path.watch.js, build);
    watch(path.watch.html, build);
    _browserSync();
}
