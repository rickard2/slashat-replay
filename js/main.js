// https://raw.github.com/zeflasher/ember-require-js/master/app/js/main.js

// Define libraries
require.config
({
    baseUrl: 'js/',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        ember: '../bower_components/ember/ember.prod',
        handlebars: '../bower_components/handlebars/handlebars',
        moment: '../bower_components/momentjs/moment',
        templates: '../build/templates'
    },

    // Used for non module library (ie not using requireJS define) to specify the dependencies this library has
    shim: {
        'ember': {
            deps: ['handlebars', 'jquery'],
            exports: 'Ember'
        }
    }
});

//requirejs.onError = function (err) {
//    console.log(err.requireType);
//    if (err.requireType === 'timeout') {
//        console.log('modules: ' + err.requireModules);
//    }
//
//    throw err;
//};

require([
    'app',

    'templates',

    // Router will import all routes
    '_router',

    'component/chat-log',
    'component/youtube-video',
    'component/moment-format',

    'controller/video',

    'model/log_entry',
    'model/video'
],
    function (App) {
        App.advanceReadiness();
    }
);
