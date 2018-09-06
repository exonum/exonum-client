module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      dist: {
        src: ['./src/**/*.js']
      },
      tests: {
        src: ['./test/**/*.js']
      }
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
          transform: [['babelify', {'presets': ['es2015']}]]
        },
        src: './src/index.js',
        dest: './dist/<%= pkg.name %>.js'
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= pkg.version %>'
            }
          ]
        },
        files: [
          { src: ['./lib/index.js'], dest: './lib/index.js' }
        ]
      }
    },
    uglify: {
      dist: {
        src: './dist/<%= pkg.name %>.js',
        dest: './dist/<%= pkg.name %>.min.js'
      }
    },
    mochaTest: {
      dist: {
        options: {
          reporter: 'spec',
          require: ['babel-register']
        },
        // src: ['./test/sources/**/*.js']
        src: [
          './test/sources/converters.js',
          './test/sources/serialization.js',
          './test/sources/cryptography.js'
        ]
      },
      all: {
        options: {
          reporter: 'spec',
          require: ['babel-register']
        },
        // src: ['./test/**/*.js']
        src: [
          './test/sources/converters.js',
          './test/sources/serialization.js',
          './test/sources/cryptography.js'
        ]
      }
    }
  })

  grunt.registerTask('compile', ['eslint', 'clean', 'babel', 'replace', 'browserify', 'uglify'])
  grunt.registerTask('test', ['eslint:tests', 'mochaTest'])
  grunt.registerTask('default', ['compile', 'eslint:tests', 'mochaTest:all'])
}
