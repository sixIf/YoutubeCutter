const webpack = require('webpack');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      builderOptions: {
        publish: ['github'],
        extraFiles: {
          from: 'node_modules/ffmpeg-static/ffmpeg.exe',
          to: './resources/app.asar.unpacked/ffmpeg.exe'
        }
      },
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
        config.plugin('define').tap((args) => {
          // See https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/573#issuecomment-305408048 for details
          args[0]['process.env.FLUENTFFMPEG_COV'] = false
          return args
        })
      },
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
        config.plugin('define').tap((args) => {
          // See https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/573#issuecomment-305408048 for details
          args[0]['process.env.FLUENTFFMPEG_COV'] = false
          return args
        })
      },
      // Or, for multiple preload files:
      // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      })
    ]
  }
}