var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  assetsDir: 'static',

  configureWebpack: {
    // used for debugging in Visual Studio Code: https://vuejs.org/v2/cookbook/debugging-in-vscode.html
    devtool: 'source-map',
    plugins: [
      new LodashModuleReplacementPlugin({
        paths: true,
      }),
    ],
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8000',
      },
      '^/admin': {
        target: 'http://localhost:8000',
      },
      '^/static': {
        target: 'http://localhost:8000',
      },
    },
  },
};
