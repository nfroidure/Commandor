// Karma configuration
// Generated on Fri Aug 16 2013 14:04:23 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '.',


    // frameworks to use
    frameworks: ['mocha', 'requirejs', 'effroi'],


    // list of files / patterns to load in the browser
    files: [
      'tests/main.karma.js',
      {pattern: 'src/*.js', included: false},
      {pattern: 'tests/polyfills.karma.js', included: false},
      {pattern: 'tests/*.mocha.js', included: false}
    ],


    /*// list of files to exclude
    exclude: [
      
    ],*/


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome', 'PhantomJS', 'SlimerJS', 'Firefox', 'Opera'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
