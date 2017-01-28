module.exports = ->
  @loadNpmTasks 'grunt-contrib-copy'

  chromeDest = 'chrome-extension/dist/extension'

  npmDeps = [
    'node_modules/diffhtml/dist/diffhtml.js'
    'node_modules/diffhtml-logger/dist/logger.js'
    'node_modules/diffhtml-components/dist/components.js'
    'node_modules/diffhtml-synthetic-events/dist/synthetic-events.js'
  ]

  @config 'copy',
    'chrome-extension':
      files: [
        {
          src: npmDeps
          expand: true
          dest: chromeDest
        }
        {
          src: [
            '**/*'
            '!_assets/**'
          ]
          expand: true
          cwd: 'shared'
          dest: chromeDest
        }
        {
          src: [
            'manifest.json'
            '_locales/**'
          ]
          expand: true
          cwd: 'chrome-extension'
          dest: chromeDest
        }
      ]
