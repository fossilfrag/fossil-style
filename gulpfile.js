const gulp = require('gulp');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const minifyStyle = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

const browserSync = require('browser-sync').create();

// Project Path
const src = {
    root: 'src',
    docs: 'src/docs',
    assets: 'src/assets',
    styles: 'src/assets/scss',
    scripts: 'src/assets/js',
}

// Distribution Path
const dist = {
    root: 'dist',
    assets: 'dist/assets',
    docs: 'dist/docs'
}

// Develop Path
const build = {
    root: 'build',
    assets: 'build/assets',
    styles: 'build/assets/css',
    scripts: 'build/assets/js'
}

function html() {
}

function css() {
    return gulp.src(src.styles + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browserList: [
                "last 2 versions",
                "ie >= 11"
            ]
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(build.assets + '/css'))
        .pipe(gulp.dest(dist.assets + '/css'))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(filter('**/*.css'))
        .pipe(minifyStyle())
        .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(dist.assets + '/css'))
        .pipe(filter('**/*.css'))
        .pipe(browserSync.stream({once: true}));
}

function js() {
}

function watch() {
    browserSync.init({
        notify: false,
        port: 3000,
        server: {
            baseDir: './dist',
            index: '/index.html'
        },
        watchOptions: {
            awaitWriteFinish: true
        }
    });

    gulp.watch('src/**/*.html', html);
    gulp.watch('src/assets/scss/**/*.scss', css);
    gulp.watch('src/assets/js/**/*.js', js);
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.watch = watch;
exports.default = gulp.series(gulp.parallel(html, css, js, watch));