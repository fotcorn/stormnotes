var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  configureWebpack: {
    // used for debugging in Visual Studio Code: https://vuejs.org/v2/cookbook/debugging-in-vscode.html
    devtool: 'source-map',
    plugins: [
      new LodashModuleReplacementPlugin({
        paths: true,
      }),
    ],
  },
};
