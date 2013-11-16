// https://raw.github.com/zeflasher/ember-require-js/master/app/js/main.js

// Define libraries
require.config
({
    baseUrl: 'js/',
    paths: {
        jquery: '../bower_components/jquery/jquery',
        ember: '../bower_components/ember/ember',
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

requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }

    throw err;
};

require([
    'app',

    'templates',

    // Router will import all routes
    'router',

    'component/chat-log',
    'component/youtube-video',

    'controller/video',

    'model/log_entry',
    'model/video'
],
    function (App) {
    }
);