const path = require('path');

// Enb technologies
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const enbBaseTechs = require('enb-bem-techs');
const enbFileProvide = require('enb/techs/file-provider');
const enbBorschik = require('enb-borschik/techs/borschik');
const enbStylus = require('enb-stylus/techs/stylus');
const enbPostcss = require('enb-bundle-postcss/techs/enb-bundle-postcss');
const enbBabelBrowserJs = require('enb-babelify/techs/babel-browser-js');
const enbBrowserJs = require('enb-js/techs/browser-js');
const enbFileMerge = require('enb/techs/file-merge');
const enbBemtree = require('enb-bemxjst/techs/bemtree');
const enbBemhtml = require('enb-bemxjst/techs/bemhtml');
const postcssImport = require('postcss-import');
const postcssCssnext = require('postcss-cssnext');
const postcssSharps = require('sharps').postcss;
/* eslint-enable import/no-extraneous-dependencies, import/no-unresolved */

// Final technologies
const FINAL_TECHS = {
    css: {
        sourceSuffixes: ['styl', 'css', 'post.css'],
        target: '?.css',
        borschik: {
            target: '?.min.css',
            tech: 'cleancss',
        },
    },
    'browser-js': {
        sourceSuffixes: ['js', 'vanilla.js', 'browser.js'],
        target: '?.browser.js',
        borschik: {
            target: '?.browser.min.js',
            tech: 'js',
        },
    },
    bemtree: {
        sourceSuffixes: 'bemtree.js',
        target: '?.bemtree.js',
        borschik: {
            target: '?.bemtree.min.js',
            tech: 'js',
            minify: false, // TODO: uglify no support es6
        },
    },
    bemhtml: {
        sourceSuffixes: ['bemhtml.js', 'bemhtml'],
        target: '?.bemhtml.js',
        borschik: {
            target: '?.bemhtml.min.js',
            tech: 'js',
            minify: false, // TODO: uglify no support es6
        },
    },
};

module.exports = class {

    constructor(config) {
        this._config = config;
    }

    init(nodes, levels, isMinify) {
        isMinify = Boolean(isMinify);

        this._nodes = nodes;
        this._isMinify = isMinify;
        this._isSourcemap = !isMinify;

        this._addTechsAndTargets(levels);
        this._addTasks();
    }

    _addTechsAndTargets(levels) {
        this._config.nodes(this._nodes, (nodeConfig) => {
            nodeConfig.addTechs(this._getTechs(levels));
            nodeConfig.addTargets(this._getTargets());
        });
    }

    _getTechs(levels) {
        /* eslint-disable no-underscore-dangle */
        return [].concat([
            this.constructor._getFilesTechs(levels),
            this._getCssTechs(),
            this.constructor._getBrowserJsTechs(),
            this.constructor._getBrowserBemhtmlTechs(),
            this.constructor._getBemtreeTechs(),
            this.constructor._getServerBemhtmlTechs(),
            this._getOptimizationTechs(),
        ]);
        /* eslint-enable no-underscore-dangle */
    }

    static _getTargets() {
        return Object
            .keys(FINAL_TECHS)
            .reduce((result, key) => {
                const tech = FINAL_TECHS[key];
                const target = tech.borschik
                    ? tech.borschik.target
                    : tech.target;

                result.push(target);

                return result;
            }, []);
    }

    _addTasks() {
        Object
            .keys(FINAL_TECHS)
            .forEach((key) => {
                const tech = FINAL_TECHS[key];
                const target = tech.borschik
                    ? tech.borschik.target
                    : tech.target;

                this._addTask(key, target.slice(2));
            });
    }

    _addTask(taskName, fileSuffix) {

        this._config.task(taskName, (task) => {

            task.buildTargets(this._nodes.map((node) => {
                const fileName = path.basename(node) + '.' + fileSuffix;

                return path.join(node, fileName);
            }));
        });
    }

    static _getFilesTechs(levels) {
        return [
            [enbFileProvide, {
                target: '?.bemdecl.js',
            }],
            [enbBaseTechs.levels, {
                levels,
            }],
            [enbBaseTechs.deps],
            [enbBaseTechs.files],
        ];
    }

    static _getBemtreeTechs() {
        const tech = FINAL_TECHS.bemtree;
        let result = [];

        if (tech) {
            result = [
                [enbBemtree, {
                    sourceSuffixes: tech.sourceSuffixes,
                    target: tech.target,
                }],
            ];
        }

        return result;
    }

    static _getServerBemhtmlTechs() {
        const tech = FINAL_TECHS.bemhtml;
        let result = [];

        if (tech) {
            result = [
                [enbBemhtml, {
                    sourceSuffixes: tech.sourceSuffixes,
                    target: tech.target,
                }],
            ];
        }

        return result;
    }

    static _getBrowserBemhtmlTechs() {
        let result = [];

        if (FINAL_TECHS['browser-js']) {
            result = [
                [enbBaseTechs.depsByTechToBemdecl, {
                    target: '?.bemhtml.bemdecl.js',
                    sourceTech: 'js',
                    destTech: 'bemhtml',
                }],
                [enbBaseTechs.deps, {
                    target: '?.bemhtml.deps.js',
                    bemdeclFile: '?.bemhtml.bemdecl.js',
                }],
                [enbBaseTechs.files, {
                    depsFile: '?.bemhtml.deps.js',
                    filesTarget: '?.bemhtml.files',
                    dirsTarget: '?.bemhtml.dirs',
                }],
                [enbBemhtml, {
                    target: '?.browser.bemhtml.js',
                    filesTarget: '?.bemhtml.files',
                }],
            ];
        }

        return result;
    }

    static _getBrowserJsTechs() {
        const tech = FINAL_TECHS['browser-js'];
        let result = [];

        if (tech) {

            result = [
                [enbBrowserJs, {
                    sourceSuffixes: tech.sourceSuffixes,
                    target: '?.browser.ym.js',
                    includeYM: true,
                }],
                [enbFileMerge, {
                    sources: [
                        '?.browser.ym.js',
                        '?.browser.bemhtml.js',
                    ],
                    target: '?.browser.ym+bemhtml.js',
                }],
                [enbBabelBrowserJs, {
                    sourceTarget: '?.browser.ym+bemhtml.js',
                    target: tech.target,
                    babelOptions: {
                        compact: false,
                        presets: [
                            'es2015',
                        ],
                    },
                }],
            ];
        }

        return result;
    }

    _getCssTechs() {
        const tech = FINAL_TECHS.css;
        let result = [];

        if (tech) {
            result = [
                [enbStylus, {
                    sourceSuffixes: tech.sourceSuffixes,
                    target: '?.pre.css',
                    imports: false,
                }],
                [enbPostcss, {
                    source: '?.pre.css',
                    target: tech.target,
                    sourcemap: this._isSourcemap,
                    plugins: this._getPostcssPlugins(),
                }],
            ];
        }

        return result;
    }

    static _getPostcssPlugins() {
        let result = [];

        if (FINAL_TECHS.css) {
            result = [
                postcssImport,
                postcssCssnext,
                postcssSharps({
                    columns: 12,
                    maxWidth: '1400px',
                    gutter: '1rem',
                    flex: 'flex',
                }),
            ];
        }

        return result;
    }

    _getOptimizationTechs() {
        return Object
            .keys(FINAL_TECHS)
            .reduce((result, key) => {
                const tech = FINAL_TECHS[key];

                if (tech.borschik) {
                    const item = Object.assign({
                        source: tech.target,
                        minify: this._isMinify,
                    }, tech.borschik);

                    result.push([enbBorschik, item]);
                }

                return result;
            }, []);
    }
};
