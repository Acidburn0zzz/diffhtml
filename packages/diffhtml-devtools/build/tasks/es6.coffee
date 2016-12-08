transpiler = require 'es6-module-transpiler'

buildES6 = (options) ->
  container = new transpiler.Container(
    resolvers: [new transpiler.FileResolver([options.path])]
    formatter: new transpiler.formatters.bundle
  )

  container.getModule options.module

  if options.target is "chrome-extension"
    container.write "chrome-extension/dist/extension/" + options.chrome

module.exports = ->
  @registerTask 'es6', 'Compiles ES6 modules.', ->

    target = @args[0]

    # Background.
    buildES6
      target: target
      path: 'shared/scripts'
      module: 'background'
      chrome: 'js/background.js'

    # ContentScript.
    buildES6
      target: target
      path: 'shared/scripts'
      module: 'contentscript'
      chrome: 'js/contentscript.js'

    # Devtools.
    buildES6
      target: target
      path: 'shared/scripts'
      module: 'devtools'
      chrome: 'js/devtools.js'

    # Panel.
    buildES6
      target: target
      path: 'shared/scripts'
      module: 'panel'
      chrome: 'js/panel.js'
