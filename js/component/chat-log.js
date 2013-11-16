define('component/chat-log', ['app', 'ember'], function (App, Ember) {

    App.ChatLogComponent = Ember.Component.extend({
        classNames: ['chat-log'],
        currentEntries: function () {

            var currentTime = this.get('currentTime');

            return this.get('entries').filter(function (entry) {
                return entry.get('time') <= currentTime;
            });

        }.property('entries.length', 'currentTime')
    });
});