"use strict";

const path = require('path');
const fs = require('fs');

const chai = require('chai');
const expect = chai.expect;
const glob = require('glob');
const del = require('del');
const build = require('../lib/build');

function readFile(s) {
    return fs.readFileSync(s, 'utf8');
}

function filterBase64(str) {
    return str
        .replace(/data:image\/[a-zA-Z0-9=\+\/,;]+/g, '') // 内联图片不作检查
        .replace(/data:application\/json;charset=utf-8;base64,[a-zA-Z0-9=\+\/,;]+/g, '');
}

const REG_BABEL_RUNTIME_CORE = /(__WEBPACK_IMPORTED_MODULE_\d+_)[A-Za-z0-9_]+(_babel_runtime_)/g;
function testBuild(webpackConfig, fixtureDir, options = {}) {
    return new Promise(function(resolve, reject) {
        const cwd = path.join(__dirname, 'fixtures', fixtureDir);
        const cacheDir = path.join(cwd, '.guido-cache');
        const outputDir = path.join(cwd, 'dist');

        const expectDir = path.join(__dirname, 'expect', fixtureDir);

        process.chdir(cwd);
        del.sync(outputDir);

        webpackConfig.env || (webpackConfig.env = '');
        webpackConfig.cwd = cwd;
        webpackConfig.quiet === undefined && (webpackConfig.quiet = true); // 不输出任何信息

        build(webpackConfig, function (error) {
            if (error) {
                reject(error);
            }

            const actualFiles = glob.sync('**/*', {
                cwd: outputDir,
                nodir: true
            });

            actualFiles.forEach(function (file) {
                // 图片不作检查
                if ('.png|.jpeg|.jpg|.gif'.indexOf(path.extname(file)) === -1) {
                    let outputFile = readFile(path.join(outputDir, file));
                    let expectFile = readFile(path.join(expectDir, file));
                    outputFile = filterBase64(outputFile).replace(/[\n\r\s]+/g, '');
                    expectFile = filterBase64(expectFile).replace(/[\n\r\s]+/g, '');

                    outputFile = outputFile.replace(REG_BABEL_RUNTIME_CORE, '$1$2');
                    expectFile = expectFile.replace(REG_BABEL_RUNTIME_CORE, '$1$2');
                    expect(outputFile).to.equal(expectFile);
                }
            });

            del.sync(cacheDir);

            resolve();
        });
    });
}


describe('Build', function() {
    this.timeout(200000);

    it('browserslist', function() {
        return testBuild({}, 'browserslist');
    });
    it('code-splitted-css-bundle', function() {
        return testBuild({}, 'code-splitted-css-bundle');
    });
    it('code-splitted-require.context', function() {
        return testBuild({}, 'code-splitted-require.context');
    });
    it('code-splitted-require.context-amd', function() {
        return testBuild({}, 'code-splitted-require.context-amd');
    });
    it('code-splitting', function() {
        return testBuild({}, 'code-splitting');
    });
    it('code-splitting-harmony', function() {
        return testBuild({}, 'code-splitting-harmony');
    });
    it('common-chunk-and-vendor-chunk', function() {
        return testBuild({}, 'common-chunk-and-vendor-chunk');
    });
    it('commonjs', function() {
        return testBuild({}, 'commonjs');
    });
    it('css', function() {
        return testBuild({}, 'css');
    });
    it('css-font-url', function() {
        return testBuild({}, 'css-font-url');
    });
    it('css-modules', function() {
        return testBuild({}, 'css-modules');
    });
    it('custom-structure', function() {
        return testBuild({}, 'custom-structure');
    });
    it('development-env', function() {
        return testBuild({
            env: 'development'
        }, 'development-env');
    });
    it('es6 to es5', function() {
        return testBuild({}, 'es6-to-es5');
    });
    it('eslint', function() {
        return testBuild({}, 'eslint');
    });
    it('extra-async-chunk', function() {
        return testBuild({}, 'extra-async-chunk');
    });
    it('handlebars', function() {
        return testBuild({}, 'handlebars');
    });
    it('harmony-unused', function() {
        return testBuild({}, 'harmony-unused');
    });
    it('image-dataurl', function() {
        return testBuild({}, 'image-dataurl', {
            ignoreImageBase64: true
        });
    });
    it('imagemin-jpg-min', function() {
        return testBuild({
            env: 'production'
        }, 'imagemin-jpg-min', {
            ignoreImageBase64: true
        });
    });
    it('imagemin-jpg-min-disabled', function() {
        return testBuild({
            env: 'production'
        }, 'imagemin-jpg-min-disabled', {
            ignoreImageBase64: true
        });
    });
    it('jsx', function() {
        return testBuild({}, 'jsx');
    });
    it('production-env', function() {
        return testBuild({
            env: 'production'
        }, 'production-env');
    });
    it('require.context', function() {
        return testBuild({}, 'require.context');
    });
    it('require.resolve', function() {
        return testBuild({}, 'require.resolve');
    });
    it('scss', function() {
        return testBuild({}, 'scss');
    });
    it('scss-modules', function() {
        return testBuild({}, 'scss-modules');
    });
    it('sprites', function() {
        return testBuild({}, 'sprites');
    });
    it('sprites-retina', function() {
        return testBuild({}, 'sprites-retina');
    });
    it('svg-inline', function() {
        return testBuild({}, 'svg-inline');
    });
    it('svg-sprite', function() {
        return testBuild({}, 'svg-sprite');
    });
    it('svg-url', function() {
        return testBuild({}, 'svg-url');
    });
    it('svg-to-font', function() {
        return testBuild({}, 'svg-to-font');
    });
    it('sprites-split', function() {
        return testBuild({}, 'sprites-split');
    });
    it('sprites-split-retina', function() {
        return testBuild({}, 'sprites-split-retina');
    });
    it('template-crossorigin', function() {
        return testBuild({}, 'template-crossorigin');
    });
    it('template-css-inline', function() {
        return testBuild({}, 'template-css-inline');
    });
    it('template-dist-resources', function() {
        return testBuild({}, 'template-dist-resources');
    });
    it('template-filter', function() {
        return testBuild({}, 'template-filter');
    });
    it('template-helper', function() {
        return testBuild({}, 'template-helper');
    });
    it('template-image', function() {
        return testBuild({}, 'template-image');
    });
    it('template-minify', function() {
        return testBuild({}, 'template-minify');
    });
    it('template-nunjucks', function() {
        return testBuild({}, 'template-nunjucks');
    });
    it('template-partial', function() {
        return testBuild({}, 'template-partial');
    });
    it('template-publish-resources', function() {
        return testBuild({}, 'template-publish-resources');
    });
    it('template-render-data', function() {
        return testBuild({}, 'template-render-data');
    });
    it('template-require-resources', function() {
        return testBuild({}, 'template-require-resources');
    });
    it('umd', function() {
        return testBuild({}, 'umd');
    });
    it('verbose-mode', function() {
        return testBuild({
            quiet: false
        }, 'verbose-mode');
    });
});
