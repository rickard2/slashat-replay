define('route/index', ['ember', 'app', 'loader'], function (Ember, App, Loader) {
    App.IndexRoute = Ember.Route.extend({
        model: function () {
            return Loader.findAll();
        }
    });
});