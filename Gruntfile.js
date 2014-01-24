/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    define: true,
                    require: true,
                    requirejs: true,
                    YT: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                src: ['js/**/*.js']
            }
        },
        watch: {
            emberTemplates: {
                files: 'templates/*.hbs',
                tasks: ['emberTemplates']
            }
        },
        emberTemplates: {
            compile: {
                options: {
                    amd: true,
                    templateBasePath: 'templates/',
                    templateName: function (name) {

                        if (name.match(/[a-z]+-[a-z]+/i)) {
                            return 'components/' + name;
                        }

                        return name;
                    }
                },
                files: {
                    "build/templates.js": "templates/*hbs"
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js/',
                    mainConfigFile: "js/main.js",
                    out: "app.js",
                    name: 'main'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-ember-templates');

    grunt.registerTask('build', ['jshint', 'emberTemplates', 'requirejs']);
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
