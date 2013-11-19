define('component/chat-statistics', ['app', 'ember'], function (App, Ember) {

    App.ChatStatisticsComponent = Ember.Component.extend({
        messageCount: Ember.computed.alias('entries.length'),
        userCount: Ember.computed.alias('userData.length'),

        anonymousCount: function () {
            return this.get('userData').filterProperty('anonymous').get('length');
        }.property('userData'),

        anonymousPercent: function () {

            var userCount = this.get('userCount');

            if (!userCount) {
                return 0;
            }

            return ((this.get('anonymousCount') / userCount) * 100).toFixed(2);
        }.property('anonymousCount', 'userCount'),

        messagesPerMinute: function () {

            var start = this.get('entries.firstObject.time');
            var end = this.get('entries.lastObject.time');

            var startMoment = moment(start);
            var endMoment = moment(end);

            var diffMinutes = (endMoment.unix() - startMoment.unix()) / 60;

            if (!diffMinutes) {
                return 0;
            }

            var messagesPerMinute = this.get('messageCount') / diffMinutes;

            return messagesPerMinute.toFixed(2);

        }.property('entries.firstObject', 'entries.lastObject', 'messageCount'),

        userData: function () {
            var userCountMap = {};
            var result = [];

            this.get('entries').forEach(function (entry) {
                var user = entry.get('user');

                if (!userCountMap[user]) {
                    userCountMap[user] = 0;
                }

                userCountMap[user]++;
            });

            for (var key in userCountMap) {
                if (userCountMap.hasOwnProperty(key)) {
                    result.push({user: key, count: userCountMap[key], anonymous: !!key.match(/^ustreamer-/)});
                }
            }

            return result;

        }.property('entries.@each.user'),

        mostMessagesData: function () {
            var max = false;

            var userData = this.get('userData');

            userData.forEach(function (item) {
                if (!max || item.count > max.count) {
                    max = item;
                }
            });

            return max;
        }.property('userData'),

        topList: function () {

            var userData = this.get('userData').toArray();

            userData.sort(function (a, b) {
                return b.count - a.count;
            });

            return userData.splice(0, 5);

        }.property('userData')
    });
});