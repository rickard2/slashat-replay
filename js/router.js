define('router', ['app', 'route/video', 'route/index'], function (App) {
    App.Router.map(function () {
        this.route('video', {path: '/:video_id'});
    });
});
