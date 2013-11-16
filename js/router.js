define('router', ['app', 'route/video', 'route/application'], function (App) {
    App.Router.map(function () {
        this.route('video', {path: '/:video_id'});
    });
});
