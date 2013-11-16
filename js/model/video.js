define('model/video', ['app', 'ember'], function (App, Ember) {
    App.Video = Ember.Object.extend({
        init: function () {
            this.set('log', []);
            this._super();
        }
    });

    return App.Video;
});
