let gulp = require('gulp'),
    pug = require('gulp-pug'),
    pugbem = require('gulp-pugbem'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    csscomb = require('gulp-csscomb'),
    remember = require('gulp-remember'),
    flatmap = require('gulp-flatmap'),
    merge2 = require('merge2'),
    order = require('gulp-order'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    beautifyCode = require('gulp-beautify-code'),
    gulpIf = require('gulp-if'),
    useref = require('gulp-useref'),
    multipipe = require('multipipe'),
    svgSprite = require('gulp-svg-sprites'),
    path = require('path'),
    del = require('del'),
    production = false;


gulp.task('pages', () => {
    return gulp.src('develop/*.pug', {since: gulp.lastRun('pages')})
        .pipe(remember('pages'))
        .pipe(flatmap(function(stream, file){
            return merge2(
                gulp.src('develop/components/**/*.pug', {since: gulp.lastRun('pages')})
                    .pipe(remember('comps'))
                , stream)
                .pipe(concat(file.basename));
        }))
        .pipe(pug({pretty: true, plugins: [pugbem]}))
        .pipe(gulp.dest('public'))
        .pipe(gulpIf(production, multipipe(
            beautifyCode({extra_liners: ['head','body','main','header','nav','section','article','aside','footer','/main','/html']}),
            useref(),
            gulpIf('*.css', cleanCSS()),
            gulpIf('*.js', uglify()),
            gulp.dest('public')
        )));
});

gulp.task('styles', () => {
    return gulp.src('develop/components/**/*.scss', {since: gulp.lastRun('styles')})
        .pipe(remember('styles'))
        .pipe(order([
            'helpers/variables.scss',
            'helpers/mixins.scss',
            'helpers/fonts.scss',
            'helpers/global.scss'
        ]))
        .pipe(concat('main.scss'))
        .pipe(sass())
        .pipe(gulpIf(production, multipipe(
            autoprefixer({browsers:['last 15 versions']}),
            csscomb()
        )))
        .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', () => {
    return gulp.src('develop/components/**/*.js', {since: gulp.lastRun('scripts')})
        .pipe(remember('scripts'))
        .pipe(order([
            'helpers/global.js'
        ]))
        .pipe(concat('main.js'))
        .pipe(gulpIf(production, multipipe(
            babel({presets: ['env']}),
            beautifyCode()
        )))
        .pipe(gulp.dest('public/js'));
});

gulp.task('symbols', function () {
    return gulp.src('develop/symbols/**/*.svg')
        .pipe(svgSprite({
            mode: 'symbols',
            preview: false,
            svg: {
                symbols: 'symbols.svg'
            }
        }))
        .pipe(gulp.dest('public/img'));
});

gulp.task('serve', (done) => {
    browserSync.init({
        server: {
            baseDir: 'public'
        },
        notify: false
    });
    done();
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('clean', () => {
    return del('public');
});

gulp.task('publish', (done) => {
    production = true;
    done();
});

gulp.task('copy:favicon', (done) => {
    gulp.src('develop/favicon.ico').pipe(gulp.dest('public'));
    done();
});
gulp.task('copy:fonts', (done) => {
    gulp.src('develop/fonts/**/*').pipe(gulp.dest('public/fonts'));
    done();
});
gulp.task('copy:images', (done) => {
    gulp.src('develop/images/**/*').pipe(gulp.dest('public/img'));
    done();
});
gulp.task('copy:movies', (done) => {
    gulp.src('develop/movies/**/*').pipe(gulp.dest('public/mov'));
    done();
});
gulp.task('copy:libraries', (done) => {
    gulp.src('develop/libraries/**/*').pipe(gulp.dest('public/libs'));
    done();
});
gulp.task('copy:ajax', (done) => {
    gulp.src('develop/ajax/**/*').pipe(gulp.dest('public/ajax'));
    done();
});

gulp.task('watch', () => {
    gulp.watch('develop/*.pug', gulp.series('pages', 'reload'))
        .on('unlink', function(filepath) {
            remember.forget('pages', path.resolve(filepath));
        });
    gulp.watch('develop/components/**/*.pug', gulp.series('pages', 'reload'))
        .on('unlink', function(filepath) {
            remember.forget('comps', path.resolve(filepath));
        });
    gulp.watch('develop/components/**/*.scss', gulp.series('styles', 'reload'))
        .on('unlink', function(filepath) {
            remember.forget('styles', path.resolve(filepath));
        });
    gulp.watch('develop/components/**/*.js', gulp.series('scripts', 'reload'))
        .on('unlink', function(filepath) {
            remember.forget('scripts', path.resolve(filepath));
        });
    gulp.watch('develop/favicon.ico', gulp.series('copy:favicon', 'reload'));
    gulp.watch('develop/fonts/**/*', gulp.series('copy:fonts', 'reload'));
    gulp.watch('develop/images/**/*', gulp.series('copy:images', 'reload'));
    gulp.watch('develop/movies/**/*', gulp.series('copy:movies', 'reload'));
    gulp.watch('develop/libraries/**/*', gulp.series('copy:libraries', 'reload'));
    gulp.watch('develop/ajax/**/*', gulp.series('copy:ajax', 'reload'));
});

gulp.task('copy', gulp.series('copy:favicon', 'copy:fonts', 'copy:images', 'copy:movies', 'copy:libraries', 'copy:ajax'));
gulp.task('default', gulp.series('clean', 'styles', 'scripts', 'pages', 'copy', 'symbols', 'serve', 'watch'));
gulp.task('build', gulp.series('publish', 'default'));