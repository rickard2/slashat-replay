define('route/application', ['ember', 'app', 'loader'], function (Ember, App, Loader) {
    App.ApplicationRoute = Ember.Route.extend({
        model: function () {
            return Loader.findAll();
        }
    });
});