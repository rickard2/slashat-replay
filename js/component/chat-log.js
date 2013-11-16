define('component/chat-log', ['app', 'ember'], function (App, Ember) {

    App.ChatLogComponent = Ember.Component.extend({
        classNames: ['chat-log'],
        autoScroll: true,
        lastCount: 0,
        currentEntries: [],

        updateEntries: function () {

            var currentTime = this.get('currentTime');
            var component = this;
            var lastCount = this.get('lastCount');

            var matched = this.get('entries').filter(function (entry) {
                return entry.get('time') <= currentTime;
            });

            var count = matched.get('length');


            if (count !== lastCount) {

                if (count > lastCount) {
                    var splice = (count - lastCount) * -1;
                    var delta = matched.splice(splice);
                    this.get('currentEntries').pushObjects(delta);
                } else {
                    while (this.get('currentEntries.length') > count) {
                        this.get('currentEntries').removeObject(this.get('currentEntries.lastObject'));
                    }
                }

                this.set('lastCount', count);

                Ember.run.next(function () {
                    component.trigger('newEntries');
                });
            }

        }.observes('currentTime'),

        scroll: function () {

            if (this.get('autoScroll')) {
                this.$().find('.well').animate({ scrollTop: 99999 }, 'slow');
            }
        }.on('newEntries')
    });
});