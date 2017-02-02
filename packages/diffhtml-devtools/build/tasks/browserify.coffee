module.exports = ->
  @loadNpmTasks 'grunt-browserify'

  @config 'browserify',
    'chrome-extension':
      files:
        'chrome-extension/dist/extension/js/panel.js': ['shared/scripts/panel.js']

      options:
        transform: ['babelify']

    'module':
      files:
        'module/devtools.es5.js': ['module/devtools.js']

      options:
        transform: ['babelify']
        plugin: ['browserify-derequire']

        browserifyOptions:
          standalone: 'devTools'
