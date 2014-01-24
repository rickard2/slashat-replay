define('app', ['ember'], function (Ember) {
    var App = Ember.Application.create();

    App.deferReadiness();

    return App;
});
