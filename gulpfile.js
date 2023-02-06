"use strict";
const browserSync = require('browser-sync');
const babel = require('gulp');
const watch = require('gulp-watch');
const gulp = require('gulp');
const sass = require('gulp-sass');

const folders = {
    src: "src",
    dist: "assets/"
}

const path = {
    build: {
        html: './',
        css: `${folders["dist"] + "styles/"}`,
        js: `${folders["dist"] + "scripts/"}`
    },
    serve: {
        css: `${folders["src"] + "styles/"}`,
        js: `${folders["src"] + "scripts/"}`
    },
    watch: {
        html: folders.src + "**/*.html",
        css: folders.src + "styles/*.scss",
        js: folders.src + "scripts/*.js"
    }
};

function _browserSync() {
    browserSync.init({
        server: "./"
    });
}

exports.default = function () {
    _browserSync();
};
