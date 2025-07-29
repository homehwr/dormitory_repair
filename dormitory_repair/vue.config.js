const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [],
  configureWebpack: {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify")
      }
    },
    module: {
      rules: [
        {
          test: /\.d\.ts$/,
          loader: 'ignore-loader'
        }
      ]
    }
  }
})
