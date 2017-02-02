module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'default', [
    'chrome-extension'
  ]

  @registerTask 'test', [
    'default'
    'mochaTest:chrome-extension'
  ]

  @registerTask 'chrome-extension', [
    'clean:chrome-extension'
    'compress:chrome-extension'
    'copy:chrome-extension'
    'browserify:chrome-extension'
    'es6:chrome-extension'
    'shell:chrome-extension'
  ]
