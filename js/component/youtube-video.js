define('component/youtube-video', ['app', 'ember'], function (App, Ember) {

    // Resolves whenever window.YT is available
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

        // Youtube player will replace the inserted div with their own iframe
        // To get another div to instantiate a new player in, update playerGuid to make Ember
        // re-render the view and add another div
        playerGuid: Ember.generateGuid(),

        loadPlayer: function () {

            var component = this;
            var elementInserted = new Ember.RSVP.Promise(function (resolve) {
                component.on('didInsertElement', resolve);
            });

            // Create the player after Youtube API has been loaded and the element has been inserted into DOM
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

        // Will set the current time
        getTime: function () {
            if (this.get('player').getCurrentTime) {
                this.set('currentTime', this.get('player').getCurrentTime());
            }

            this.queue();
        },

        // Will reset the player and state when a new video is selected
        reset: function () {
            this.set('playerGuid', Ember.generateGuid());
            this.get('player').destroy();
            this.set('currentTime', 0);
            this.stop();
            this.createPlayer();
        }.observes('video_id'),

        // Will enqueue the timer to update the player time
        queue: function () {
            this.set('timer', Ember.run.later(this, this.getTime, this.get('interval')));
        }.on('didCreatePlayer'),

        // Will stop the timer to update the player time
        stop: function () {
            Ember.run.cancel(this.get('timer'));
        }.on('willDestroyElement')
    });
});