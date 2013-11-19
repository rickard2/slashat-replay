define('controller/video', ['app', 'ember', 'moment'], function (App, Ember, moment) {

    App.VideoController = Ember.ObjectController.extend({
        currentTime: function () {
            var m = moment(this.get('start'));

            m.add('seconds', this.get('playerTime'));

            return m.toDate();
        }.property('playerTime', 'start'),
        currentEntries: []
    });

});