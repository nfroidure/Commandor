requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    /*paths: {
        'jquery': '../lib/jquery',
        'underscore': '../lib/underscore',
    },*/

    /*shim: {
        'underscore': {
            exports: '_'
        }
    },*/

    // ask Require.js to load these files (all our tests)
    deps: [
      '/base/tests/command.mocha.js',
      '/base/tests/form.mocha.js',
      '/base/tests/input.mocha.js',
      '/base/tests/external.mocha.js'
    ],

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
