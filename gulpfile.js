const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const sass = require('gulp-dart-sass');

const origin = 'src';
const destination = 'build';


async function clean(cb) {
    await del(destination);
    cb();
}

function html(cb) {
    src(`${origin}/**/*.html`).pipe(dest(destination));
    cb();
}

function css(cb) {
    src([
        `${origin}/css/animate.css`
    ]).pipe(dest(`${destination}/css`));
    src([
        `node_modules/bootstrap/scss/bootstrap.scss`,
        `${origin}/css/style.scss`])
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(dest(`${destination}/css`));
    cb();
}

function js(cb) {
    src([
        `node_modules/bootstrap/dist/js/bootstrap.bundle.js`
    ])
    .pipe(dest(`${destination}/js/lib`));
    src(`${origin}/js/script.js`)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest(`${destination}/js`));
    cb();
}

function watcher(cb) {
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload));
    watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload));
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload));
    cb();
}

function server(cb) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: destination
        }
    })
    cb();
}

exports.clean = clean;


exports.default = series(clean, parallel(html, css, js), server, watcher);