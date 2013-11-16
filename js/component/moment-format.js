define('component/moment-format', ['app', 'ember', 'moment'], function (App, Ember, moment) {

    App.MomentFormatComponent = Ember.Component.extend({
        tagName: '',
        format: 'YYYY-MM-DD HH:mm',
        formatted: function () {
            var value = this.get('value');

            if (!value) {
                return '';
            }

            var m = moment(value);

            if (!m || !m.isValid()) {
                return '';
            }

            return m.format(this.get('format'));

        }.property('value', 'format')
    });
});