let gulp = require('gulp'),
    pug = require('gulp-pug'),
    pugbem = require('gulp-pugbem'),
    bemblocks = require('gulp-bemblocks'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    csscomb = require('gulp-csscomb'),
    remember = require('gulp-remember'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    beautifyCode = require('gulp-beautify-code'),
    fileinclude = require('gulp-file-include'),
    multipipe = require('multipipe'),
    imagemin = require('gulp-imagemin'),
    through2 = require('through2').obj,
    babel = require('gulp-babel'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    path = require('path'),
    fs = require('fs'),
    production = false,
    multiprojects = false;

let paths = {
    components: 'develop/components',
    pages: 'develop/pages',
    styles: 'develop/styles',
    scripts: 'develop/scripts',
    out: 'public'
};


gulp.task('blocks:pug', () => {
    return gulp.src(`${paths.components}/**/*.pug`, {since: gulp.lastRun('blocks:pug')})
        .pipe(through2(function(file, enc, callback) {
            file.contents = Buffer.from("mixin " + file.stem + "(content, parent, modifier)\n" +
            "    - if (!content) content = {}\n" +
            "    - if (parent) parent += '" + `${pugbem.e || '__'}` + file.stem + "'\n" +
            "    - if (!modifier) modifier = []\n" +
            "    - if (!Array.isArray(modifier)) modifier = [modifier]\n" +
            "    - modifier = modifier.map(mod => {\n" +
            "        - if (!mod) return mod\n" +
            "        - if (parent) return `${parent}" + `${pugbem.m || '--'}` + "${mod}`\n" +
            "        - else return `" + file.stem + `${pugbem.m || '--'}` + "${mod}`\n" +
            "    - })\n" +
            "    - const ext = [parent, modifier]\n" +
            "    " + file.contents.toString().replace(/\n/g, '\n    '));
            callback(null, file);
        }))
        .pipe(remember('blocks:pug'))
        .pipe(gulpIf(multiprojects, bemblocks.lex('blocks')))
        .pipe(concat('blocks.pug'))
        .pipe(gulp.dest(`${paths.pages}/helpers`));
});

gulp.task('blocks:scss', () => {
    return gulp.src(`${paths.components}/**/*.scss`, {since: gulp.lastRun('blocks:scss')})
        .pipe(remember('blocks:scss'))
        .pipe(concat('all.scss'))
        .pipe(gulp.dest(`${paths.styles}/helpers/blocks`));
});

gulp.task('bemblocks:scss', (done) => {
    if (!bemblocks.pages.size) {
        done();
    } else {
        let result;
        for (const page of bemblocks.pages) {
            fs.writeFile(`${paths.styles}/helpers/blocks/${page[0]}.scss`, '', err => {if (err) throw err});
            result = gulp.src(`${paths.components}/{${[...page[1]].join(',')}}/**/*.scss`)
                .pipe(concat(`${page[0]}.scss`))
                .pipe(gulp.dest(`${paths.styles}/helpers/blocks`));
        }
        return result;
    }
});

gulp.task('blocks:js', () => {
    return gulp.src(`${paths.components}/**/*.js`, {since: gulp.lastRun('blocks:js')})
        .pipe(remember('blocks:js'))
        .pipe(concat('all.js'))
        .pipe(gulp.dest(`${paths.scripts}/helpers/blocks`));
});

gulp.task('bemblocks:js', (done) => {
    if (!bemblocks.pages.size) {
        done();
    } else {
        let result;
        for (const page of bemblocks.pages) {
            fs.writeFile(`${paths.scripts}/helpers/blocks/${page[0]}.js`, '', err => {if (err) throw err});
            result = gulp.src(`${paths.components}/{${[...page[1]].join(',')}}/**/*.js`)
                .pipe(concat(`${page[0]}.js`))
                .pipe(gulp.dest(`${paths.scripts}/helpers/blocks`));
        }
        return result;
    }
});


gulp.task('pages', () => {
    return gulp.src(`${paths.pages}/*.pug`)
        .pipe(gulpIf(multiprojects, bemblocks.lex('pages')))
        .pipe(pug({pretty: true, plugins: [pugbem]}))
        .pipe(gulpIf(production, beautifyCode()))
        .pipe(gulp.dest(`${paths.out}`));
});

gulp.task('bemblocks:dependencies', (done) => {
    for (const page of bemblocks.pages) {
        for (const mixin of page[1]) {
            if (bemblocks.blocks.has(mixin) && bemblocks.blocks.get(mixin).size) {
                [...bemblocks.blocks.get(mixin)].forEach(item => page[1].add(item));
            }
        }
    }
    done();
});

gulp.task('styles', () => {
    return gulp.src(`${paths.styles}/*.scss`)
        .pipe(sass())
        .pipe(gulpIf(production, multipipe(
            autoprefixer({browsers:['last 15 versions']}),
            csscomb()
        )))
        .pipe(gulp.dest(`${paths.out}/stylesheets`));
});

gulp.task('scripts', () => {
    return gulp.src(`${paths.scripts}/*.js`)
        .pipe(fileinclude({prefix: '__'}))
        .pipe(gulpIf(production, multipipe(
            babel({presets: ['env']}),
            beautifyCode()
        )))
        .pipe(gulp.dest(`${paths.out}/javascripts`));
});


gulp.task('minimization', () => {
    return gulp.src(`${paths.out}/*.html`)
        .pipe(useref())
        .pipe(gulpIf('*.css', cleanCSS()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest(`${paths.out}`));
});

gulp.task('images', () => {
    return gulp.src(`${paths.components}/**/*.{jpg,jpeg,png,gif,svg}`)
        .pipe(gulpIf(production, imagemin()))
        .pipe(gulp.dest(function(file) {
            file.path = file.base + '/' + file.relative.match(/^.+?\//)[0] + file.basename;
            return `${paths.out}/images`;
        }));
});

gulp.task('videos', () => {
    return gulp.src(`${paths.components}/**/*.{mp4,ogv,webm}`)
        .pipe(gulp.dest(function(file) {
            file.path = file.base + '/' + file.relative.match(/^.+?\//)[0] + file.basename;
            return `${paths.out}/videos`;
        }));
});

gulp.task('audios', () => {
    return gulp.src(`${paths.components}/**/*.{mp3,ogg,wav}`)
        .pipe(gulp.dest(function(file) {
            file.path = file.base + '/' + file.relative.match(/^.+?\//)[0] + file.basename;
            return `${paths.out}/audios`;
        }));
});

gulp.task('copy', () => {
    return gulp.src('develop/resources/**/*')
        .pipe(gulp.dest(`${paths.out}`));
});


gulp.task('serve', (done) => {
    browserSync.init({
        server: {
            baseDir: `${paths.out}`
        },
        notify: false
    });
    done();
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('publish', (done) => {
    production = true;
    done();
});

gulp.task('clean', () => {
    return del([`${paths.out}`, `${paths.styles}/helpers/blocks`, `${paths.scripts}/helpers/blocks`]);
});


gulp.task('watch', () => {
    gulp.watch(`${paths.components}/**/*.pug`, gulp.series('blocks:pug')).on('unlink', (file) => {
        remember.forget('blocks:pug', path.resolve(file));
    });
    gulp.watch(`${paths.components}/**/*.scss`, gulp.series('blocks:scss', 'bemblocks:scss')).on('unlink', (file) => {
        remember.forget('blocks:scss', path.resolve(file));
    });
    gulp.watch(`${paths.components}/**/*.js`, gulp.series('blocks:js', 'bemblocks:js')).on('unlink', (file) => {
        remember.forget('blocks:js', path.resolve(file));
    });
    gulp.watch(`${paths.pages}/**/*.pug`, gulp.series('pages', 'bemblocks:dependencies', 'bemblocks:scss', 'bemblocks:js', 'reload'));
    gulp.watch(`${paths.styles}/**/*.scss`, gulp.series('styles', 'reload'));
    gulp.watch(`${paths.scripts}/**/*.js`, gulp.series('scripts', 'reload'));
});

let dynamic = gulp.series('blocks:pug', 'pages', 'bemblocks:dependencies', 'blocks:scss', 'bemblocks:scss', 'styles', 'blocks:js', 'bemblocks:js', 'scripts'),
    static = gulp.series('images', 'videos', 'audios', 'copy'),
    all = gulp.series(dynamic, static);

gulp.task('default', gulp.series('clean', all, 'serve', 'watch'));
gulp.task('build', gulp.series('publish', 'clean', all, 'minimization', 'serve'));