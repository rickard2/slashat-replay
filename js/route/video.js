define('route/video', ['ember', 'app', 'loader'], function (Ember, App, Loader) {
    App.VideoRoute = Ember.Route.extend({
        setupController: function (controller, model) {
            Loader.loadLog(model);
            controller.set('content', model);
        },
        model: function (args) {
            return Loader.findBy(args.video_id);
        }
    });
});