const path = require('path');

// Enb technologies
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

// Postcss plugins
const postcss = {
    import : require('postcss-import'),
    cssnext : require('postcss-cssnext'),
    sharps : require('sharps').postcss,
};

// Final technologies
const FINAL_TECHS = {
    css : {
        sourceSuffixes : ['styl', 'css', 'post.css'],
        target : '?.css',
        borschik : {
            target : '?.min.css',
            tech : 'cleancss',
        },
    },
    'browser-js' : {
        sourceSuffixes : ['js', 'vanilla.js', 'browser.js'],
        target : '?.browser.js',
        borschik : {
            target : '?.browser.min.js',
            tech : 'js',
        },
    },
    bemtree : {
        sourceSuffixes : 'bemtree.js',
        target : '?.bemtree.js',
        borschik : {
            target : '?.bemtree.min.js',
            tech : 'js',
            minify : false, // TODO: uglify no support es6
        },
    },
    bemhtml : {
        sourceSuffixes : ['bemhtml.js', 'bemhtml'],
        target : '?.bemhtml.js',
        borschik : {
            target : '?.bemhtml.min.js',
            tech : 'js',
            minify : false, // TODO: uglify no support es6
        },
    },
};

module.exports = class {

    constructor(config) {
        this._config = config;
    }

    init(nodes, levels, env) {
        const isDev = (!env || env === 'development');

        this._nodes = nodes;
        this._isMinify = !isDev;
        this._isSourcemap = !isDev;

        this._addTechsAndTargets(levels);
        this._addTasks();
    }

    _addTechsAndTargets(levels) {
        this._config.nodes(this._nodes, nodeConfig => {
            nodeConfig.addTechs(this._getTechs(levels));
            nodeConfig.addTargets(this._getTargets());
        });
    }

    _getTechs(levels) {
        return [].concat(
            this._getFilesTechs(levels),
            this._getCssTechs(),
            this._getBrowserJsTechs(),
            this._getBrowserBemhtmlTechs(),
            this._getBemtreeTechs(),
            this._getServerBemhtmlTechs(),
            this._getOptimizationTechs()
        );
    }

    _getTargets() {
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
            .forEach(key => {
                const tech = FINAL_TECHS[key];
                const target = tech.borschik
                    ? tech.borschik.target
                    : tech.target;

                this._addTask(key, target.slice(2));
            });
    }

    _addTask(taskName, fileSuffix) {

        this._config.task(taskName, task =>

            task.buildTargets(this._nodes.map(node => {
                const fileName = path.basename(node) + '.' + fileSuffix;

                return path.join(node, fileName);
            }))
        );
    }

    _getFilesTechs(levels) {
        return [
            [enbFileProvide, {
                target : '?.bemdecl.js',
            }],
            [enbBaseTechs.levels, {
                levels,
            }],
            [enbBaseTechs.deps],
            [enbBaseTechs.files],
        ];
    }

    _getBemtreeTechs() {
        const tech = FINAL_TECHS.bemtree;
        let result = [];

        if (tech) {
            result = [
                [enbBemtree, {
                    sourceSuffixes : tech.sourceSuffixes,
                    target : tech.target,
                }],
            ];
        }

        return result;
    }

    _getServerBemhtmlTechs() {
        const tech = FINAL_TECHS.bemhtml;
        let result = [];

        if (tech) {
            result = [
                [enbBemhtml, {
                    sourceSuffixes : tech.sourceSuffixes,
                    target : tech.target,
                }],
            ];
        }

        return result;
    }

    _getBrowserBemhtmlTechs() {
        let result = [];

        if (FINAL_TECHS['browser-js']) {
            result = [
                [enbBaseTechs.depsByTechToBemdecl, {
                    target : '?.bemhtml.bemdecl.js',
                    sourceTech : 'js',
                    destTech : 'bemhtml',
                }],
                [enbBaseTechs.deps, {
                    target : '?.bemhtml.deps.js',
                    bemdeclFile : '?.bemhtml.bemdecl.js',
                }],
                [enbBaseTechs.files, {
                    depsFile : '?.bemhtml.deps.js',
                    filesTarget : '?.bemhtml.files',
                    dirsTarget : '?.bemhtml.dirs',
                }],
                [enbBemhtml, {
                    target : '?.browser.bemhtml.js',
                    filesTarget : '?.bemhtml.files',
                }],
            ];
        }

        return result;
    }

    _getBrowserJsTechs() {
        const tech = FINAL_TECHS['browser-js'];
        let result = [];

        if (tech) {

            result = [
                [enbBrowserJs, {
                    sourceSuffixes : tech.sourceSuffixes,
                    target : '?.browser.ym.js',
                    includeYM : true,
                }],
                [enbFileMerge, {
                    sources : [
                        '?.browser.ym.js',
                        '?.browser.bemhtml.js',
                    ],
                    target : '?.browser.ym+bemhtml.js',
                }],
                [enbBabelBrowserJs, {
                    sourceTarget : '?.browser.ym+bemhtml.js',
                    target : tech.target,
                    babelOptions : {
                        compact : false,
                        presets : [
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
                    sourceSuffixes : tech.sourceSuffixes,
                    target : '?.pre.css',
                    imports : false,
                }],
                [enbPostcss, {
                    source : '?.pre.css',
                    target : tech.target,
                    sourcemap : this._isSourcemap,
                    plugins : this._getPostcssPlugins(),
                }],
            ];
        }

        return result;
    }

    _getPostcssPlugins() {
        let result = [];

        if (FINAL_TECHS.css) {
            result = [
                postcss.import,
                postcss.cssnext,
                postcss.sharps({
                    columns : 12,
                    maxWidth : '1400px',
                    gutter : '1rem',
                    flex : 'flex',
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
                        source : tech.target,
                        minify : this._isMinify,
                    }, tech.borschik);

                    result.push([enbBorschik, item]);
                }

                return result;
            }, []);
    }
};
