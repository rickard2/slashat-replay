define('component/chat-log', ['app', 'ember'], function (App, Ember) {

    App.ChatLogComponent = Ember.Component.extend({
        classNames: ['chat-log'],
        autoScroll: true,
        lastCount: 0,
        currentEntries: [],

        // Add or remove entries based on the current time
        updateEntries: function () {
            var currentTime = this.get('currentTime');
            var lastCount = this.get('lastCount');
            var component = this;

            var matched = this.get('entries').filter(function (entry) {
                return entry.get('time') <= currentTime;
            });

            var count = matched.get('length');

            if (count !== lastCount) {

                // New entries, push them onto the array
                if (count > lastCount) {
                    var splice = (count - lastCount) * -1;
                    var delta = matched.splice(splice);
                    this.get('currentEntries').pushObjects(delta);
                }

                // Fewer entries, remove objects from the array
                else {
                    while (this.get('currentEntries.length') > count) {
                        this.get('currentEntries').removeObject(this.get('currentEntries.lastObject'));
                    }
                }

                this.set('lastCount', count);

                // Enqueue the event for the next run loop to make sure that Ember has re-rendered the view
                Ember.run.next(function () {
                    component.trigger('newEntries');
                });
            }

        }.observes('currentTime'),

        // Scroll down to the bottom of the chat box
        scroll: function () {
            if (this.get('autoScroll')) {
                this.$().find('.well').animate({ scrollTop: 99999 }, 'slow');
            }
        }.on('newEntries')
    });
});