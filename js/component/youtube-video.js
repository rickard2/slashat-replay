define('component/youtube-video', ['app', 'ember'], function (App, Ember) {

    var youtubeAPIReady = new Ember.RSVP.Promise(function (resolve) {
        if (window.YT) {
            resolve();
        } else {
            window.onYouTubeIframeAPIReady = resolve;
        }
    });

    App.YoutubeVideoComponent = Ember.Component.extend({
        currentTime: 0,
        interval: 1000,
        width: 640,
        height: 390,
        playerGuid: Ember.generateGuid(),

        loadPlayer: function () {

            var component = this;
            var elementInserted = new Ember.RSVP.Promise(function (resolve) {
                component.on('didInsertElement', resolve);
            });

            Ember.RSVP.all([youtubeAPIReady, elementInserted]).then(this.createPlayer.bind(this));

        }.on('init'),

        createPlayer: function () {
            this.set('player', new YT.Player('player', {
                height: this.get('height'),
                width: this.get('width'),
                videoId: this.get('video_id')
            }));

            this.trigger('didCreatePlayer');
        },

        getTime: function () {
            if (this.get('player').getCurrentTime) {
                this.set('currentTime', this.get('player').getCurrentTime());
            }

            this.queue();
        },

        reset: function () {
            this.set('playerGuid', Ember.generateGuid());
            this.get('player').destroy();
            this.set('currentTime', 0);
            this.stop();
            this.createPlayer();
        }.observes('video_id'),

        queue: function () {
            this.set('timer', Ember.run.later(this, this.getTime, this.get('interval')));
        }.on('didCreatePlayer'),

        stop: function () {
            Ember.run.cancel(this.get('timer'));
        }.on('willDestroyElement')
    });
});