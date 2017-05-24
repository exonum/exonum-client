module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                src: ['./dist']
            }
        },
        jshint: {
            files: ['./src/index.js'],
            options: {
                devel: true,
                node: true,
                funcscope: true,
                esversion: 6
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: ['babel-register']
            },
            src: ['./test/**/*.js']
        },
        browserify: {
            dist: {
                options: {
                    browserifyOptions: {debug: false, standalone: 'Exonum'},
                    transform: [["babelify", {"presets": ["es2015"]}]]
                },
                src: './src/index.js',
                dest: './dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                src: './dist/<%= pkg.name %>.js',
                dest: './dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'jshint', 'mochaTest', 'browserify', 'uglify']);

};
