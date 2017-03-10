module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                src: './dist/<%= pkg.name %>.js',
                dest: './dist/<%= pkg.name %>.min.js'
            }
        },
        browserify: {
            dist: {
                src: './src/browser.js',
                dest: './dist/<%= pkg.name %>.js'
            }
        },
        jshint: {
            files: ['./src/index.js'],
            options: {
                devel: true,
                node: true,
                funcscope: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'browserify', 'uglify']);

};
