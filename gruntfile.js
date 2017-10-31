module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'css-compiled/style.css':'scss/style.scss'
        }
      },
      build: {
        options: {
          style: 'compressed'
        },
        files: {
          'css-compiled/style.css':'scss/style.scss'
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
          'templates/partials/base.html.twig': ['templates/dev/base.html.twig']
        }
      },
      dev: {
        files: {
          'templates/partials/base.html.twig': ['templates/dev/base.html.twig']
        }
      },
    },
    watch: {
      css: {
        files: 'scss/*.scss',
        tasks: ['sass:dev'],
        options: {
          livereload: true,
          atBegin: true,
        }
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('build', ['processhtml:build','sass:build']);
  grunt.registerTask('dev', ['processhtml:dev']);
};
