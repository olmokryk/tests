const gulp = require('gulp');
const bowerFiles = require('main-bower-files');
const runSequence = require('run-sequence');
const gulpInject = require('gulp-inject');
const gulpInjectStr = require('gulp-inject-string');
const del = require('del');
const rename = require('gulp-rename');

const debugDir = "build";
const debugOutDir = debugDir + "/";

const srcPaths = {
    bowerFolder: 'bower_components',
    mainJs: 'src/js/init.js',
    servicesJs: 'src/js/services/**/*.js',
    partials: 'src/res/partials/**/*.html',
    index: 'src/index.html',
};

const outPaths = {
    appBower: "bower_components",
    appSrc: "",
    appJs: "js",
    appServices: "js/services",
    appMain: "js/main",
    appPartials: "res/partials",
    appIndex: "index.html",
    appTmpIndex: "tmp.index.html",
    appStyles: "res/styles"
};

gulp.task('default', ['build'], function () {});

gulp.task('watch', function () {
    gulp.watch([srcPaths.mainJs,
            srcPaths.servicesJs,
            srcPaths.partials,
            srcPaths.index,
            srcPaths.bowerFolder + "/**/*.js",
            srcPaths.bowerFolder + "/**/*.css"],
        ["build"]);
});

gulp.task('build', function (callback) {
    runSequence(['clean'],
        'compile',
        'link',
        callback);
});

gulp.task('clean', function () {
    return del([debugDir]);
});

gulp.task("link", function (callback) {
    runSequence('copy-index', 'link-index', 'remove-tmp-index', callback);
});

gulp.task("copy-index", function () {
    return gulp.src(srcPaths.index)
        .pipe(rename(outPaths.appTmpIndex))
        .pipe(gulp.dest(debugOutDir + outPaths.appSrc));
});

gulp.task("remove-tmp-index", function () {
    return del([debugOutDir + outPaths.appTmpIndex]);
});

gulp.task("link-index", function () {
    var mainDir = debugOutDir + outPaths.appMain + "/**/*.js";
    var cssDir = debugOutDir + outPaths.appStyles + "/**/*.css";
    var serviceDir = debugOutDir + outPaths.appServices + "/**/*.js";
    var target = debugOutDir + outPaths.appTmpIndex;
    var output = debugOutDir + outPaths.appSrc;
    return gulp.src(target)
        .pipe(
            gulpInject(
                gulp.src(mainDir, {read: false}), {"name": "main", "relative": true}))
        .pipe(
            gulpInject(
                gulp.src(cssDir, {read: false}), {"name": "styles", "relative": true}))
        .pipe(
            gulpInject(
                gulp.src(serviceDir, {read: false}), {"name": "services", "relative": true}))
        .pipe(
            gulpInject(
                gulp.src(
                    bowerFiles(
                        {
                            paths: debugOutDir,
                        }
                    ),
                    {"read": false}
                ),
                {
                    "name": "bower",
                    "relative": true
                }
            )
        )
        .pipe(rename("index.html"))
        .pipe(gulp.dest(output));
});


gulp.task('compile', ['compile-js', 'compile-html', 'compile-bower']);
gulp.task('compile-js', ['compile-services', 'compile-mainjs']);
gulp.task('compile-html', ['compile-partials']);
gulp.task('copy-bower-json', function () {
    return gulp.src('bower.json').pipe(gulp.dest(debugOutDir));
});
gulp.task('copy-bower-folder', function () {
    return gulp.src(srcPaths.bowerFolder + "/**/*").pipe(gulp.dest(debugOutDir + outPaths.appBower));
});
gulp.task('compile-bower', ['copy-bower-json', 'copy-bower-folder']);
gulp.task('compile-mainjs', function () {
    return gulp.src(srcPaths.mainJs).pipe(gulp.dest(debugOutDir + outPaths.appMain));
});
gulp.task('compile-services', function () {
    return gulp.src(srcPaths.servicesJs).pipe(gulp.dest(debugOutDir + outPaths.appServices));
});
gulp.task('compile-partials', function () {
    return gulp.src(srcPaths.partials).pipe(gulp.dest(debugOutDir + outPaths.appPartials));
});

