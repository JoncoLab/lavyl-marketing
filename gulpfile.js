'use strict';

var gulp = require("gulp"),
    autoPrefix = require("gulp-autoprefixer"),
    cssComb = require("gulp-csscomb"),
    image = require("gulp-image"),
    compileSass = require("gulp-sass"),
    rigger = require("gulp-rigger"),
    rimraf = require("rimraf"),
    zip = require("gulp-zip"),
    ftp = require("vinyl-ftp"),
    path = {
        src: {
            html: [
                'src/*.html',
                'src/*.php'
            ],
            css: 'src/styles/*.scss',
            php: 'src/scripts/php/*.php',
            img: 'src/images/*.png',
            svg: 'src/SVG/*.svg',
            font: 'src/fonts/*.ttf',
            js: [
                'src/scripts/js/*.js',
                'src/scripts/js/**/*.js',
                'src/scripts/js/**/*.html'
            ],
            zip: [
                'build/*',
                'build/**/*',
                'build/**/**/*'
            ]
        },

        build: {
            html: 'build/',
            css: 'build/styles/',
            php: 'build/scripts/php/',
            img: 'build/images/',
            svg: 'build/SVG/',
            font: 'build/fonts/',
            js: 'build/scripts/js/',
            zip: 'zip/'
        },

        watch: {
            pages: [
                'src/*.html',
                'src/*.php',
                'src/fonts/*.ttf'
            ],
            scripts: [
                'src/scripts/php/*.php',
                'src/scripts/js/*.js',
                'src/scripts/js/**/*.js',
                'src/scripts/js/**/*.html'
            ],
            styles: [
                'src/styles/*.scss',
                'src/styles/templates/*.scss'
            ],
            images: 'src/images/*.png',
            svg: 'src/SVG/*.svg'
        },

        ftp: {
            html: '/',
            css: '/styles/',
            php: '/scripts/php/',
            img: '/images/',
            svg: '/SVG/',
            font: '/fonts/',
            js: '/scripts/js/'
        },

        clean: 'build*'
    },
    connectToFtp = ftp.create({
        host: 'joncolab.ftp.ukraine.com.ua',
        user: 'joncolab_lav_aur',
        pass: '2014',
        parallel: 20
    });

//Збірка html
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(connectToFtp.newer(path.ftp.html))
        .pipe(connectToFtp.dest(path.ftp.html))
        .pipe(gulp.dest(path.build.html));
});

//Збірка php
gulp.task('php:build', function () {
    gulp.src(path.src.php)
        .pipe(rigger())
        .pipe(connectToFtp.newer(path.ftp.php))
        .pipe(connectToFtp.dest(path.ftp.php))
        .pipe(gulp.dest(path.build.php));
});

//Збірка JS
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(connectToFtp.newer(path.ftp.js))
        // .pipe(jsMinify({
        //     ext: {
        //         min: '.js'
        //     },
        //     noSource: '*.js'
        // }))
        .pipe(connectToFtp.dest(path.ftp.js))
        .pipe(gulp.dest(path.build.js));
});

//Збірка СSS
gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(compileSass().on('error', compileSass.logError))
        .pipe(cssComb())
        .pipe(autoPrefix({
            browsers: ['last 40 versions', '> 90%'],
            remove: false
        }))
        .pipe(connectToFtp.newer(path.ftp.css))
        .pipe(connectToFtp.dest(path.ftp.css))
        .pipe(gulp.dest(path.build.css));
});

//Збірка картинок
gulp.task('img:build', function () {
    gulp.src(path.src.img)
        .pipe(image())
        .pipe(connectToFtp.newer(path.ftp.img))
        .pipe(connectToFtp.dest(path.ftp.img))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('svg:build', function () {
    gulp.src(path.src.svg)
        .pipe(connectToFtp.newer(path.ftp.svg))
        .pipe(connectToFtp.dest(path.ftp.svg))
        .pipe(gulp.dest(path.build.svg));
});

//Збірка шрифтів
gulp.task('fonts:build', function () {
    gulp.src(path.src.font)
        .pipe(connectToFtp.newer(path.ftp.font))
        .pipe(connectToFtp.dest(path.ftp.font))
        .pipe(gulp.dest(path.build.font));
});

//Збірка сайту в архів для хостингу
gulp.task('zip:build', function () {
    gulp.src(path.src.zip)
        .pipe(zip('build.zip'))
        .pipe(gulp.dest(path.build.zip));
});

//Загальна збірка
gulp.task('project:build', [
    'html:build',
    'js:build',
    'css:build',
    'img:build',
    'svg:build',
    'php:build',
    'fonts:build'
]);

gulp.task('watch', function () {
    gulp.watch(path.watch.pages, [
        'html:build',
        'fonts:build'
    ]);
    gulp.watch(path.watch.styles, ['css:build']);
    gulp.watch(path.watch.scripts, [
        'js:build',
        'php:build'
    ]);
    gulp.watch(path.watch.images, ['img:build']);
    gulp.watch(path.watch.svg, ['svg:build']);
});

//Очистка
gulp.task('clean', function (callback) {
    rimraf(path.clean, callback);
});

//Запуск роботи з проектом
gulp.task('default', ['project:build', 'watch']);