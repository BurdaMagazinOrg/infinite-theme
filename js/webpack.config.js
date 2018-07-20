const path = require('path');
const glob = require('glob');

module.exports = {
  entry: {
    js: [
      './src/index.js',
    ],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'infinite.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
