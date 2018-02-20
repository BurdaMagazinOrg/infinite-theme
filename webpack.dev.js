const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = merge(common, {
  devtool: 'eval',
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      // failOnError: true,
      // set the current working directory for displaying module paths
      cwd: `${process.cwd()}/js/infinite`,
    })
  ]
});
