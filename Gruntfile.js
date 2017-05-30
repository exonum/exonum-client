module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            target: ['./src/**/*.js']
        },
        clean: {
            dist: {
                src: ['./dist', './lib']
            }
        },
        babel: {
            options: {
                presets: ['babel-preset-es2015']
            },
            dist: {
                expand: true,
                cwd: './src/',
                src: ['**/*.js'],
                dest: './lib/'
            }
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
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: ['babel-register']
            },
            src: ['./test/**/*.js']
        }
    });

    grunt.registerTask('prepublish', ['eslint', 'clean', 'babel', 'browserify', 'uglify']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['prepublish', 'test']);
};
