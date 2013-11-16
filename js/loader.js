define('loader', ['ember', 'app', 'model/video', 'model/log_entry', 'moment'], function (Ember, App, Video, LogEntry, moment) {

    var episodes;

    var Loader = {
        findAll: function () {
            return new Ember.RSVP.Promise(function (resolve, reject) {

                if (episodes) {
                    resolve(episodes);
                } else {
                    Ember.$.getJSON('data/episodes.json').then(function (data) {

                        episodes = [];

                        data.forEach(function (ep) {
                            episodes.push(Video.create(ep));
                        });

                        resolve(episodes);
                    }, reject);
                }
            });
        },
        findBy: function (id) {
            return new Ember.RSVP.Promise(function (resolve, reject) {
                Loader.findAll().then(function (data) {

                    var result = data.findBy('id', id);

                    if (result) {
                        resolve(result);
                    } else {
                        reject();
                    }
                }, reject);
            });
        },
        loadLog: function (video) {
            if (!video.get('log.length')) {
                Ember.$.getJSON('data/' + video.get('id') + '.json').then(function (log) {
                    var result = [];

                    log.forEach(function (item) {
                        item.time = moment(item.time).toDate();
                        result.push(LogEntry.create(item));
                    });

                    video.set('log', result);
                });
            }
        }
    };

    return Loader;

});