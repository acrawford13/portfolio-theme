module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'css/style.css':'src/scss/style.scss'
        }
      },
      build: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/style.css':'src/scss/style.scss'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    processhtml: {
      build: {
        files: {
          'templates/partials/base.html.twig': ['templates/partials/base.html.twig']
        }
      },
      dev: {
        files: {
          'templates/partials/base.html.twig': ['templates/partials/base.html.twig']
        }
      },
    },
    watch: {
      css: {
        files: 'src/**/*',
        tasks: ['copy','sass:dev'],
        options: {
          livereload: true,
          atBegin: true,
        }
      },
    },
    copy: {
        main: {
            files: [
                {
                    cwd: 'src',
                    src: ['images/**', 'js/**', 'templates/**'],
                    dest: '.',
                    expand: true,
                }
            ]
        }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('build', ['copy', 'processhtml:build','sass:build']);
  grunt.registerTask('dev', ['copy', 'sass:dev', 'processhtml:dev']);
};
