const path = require('path')

module.exports =  {
  entry: {
    main: './js/infinite/infinite-bundle'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  plugins: [
  ]
}
