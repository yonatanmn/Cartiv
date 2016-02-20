var path = require('path')
var webpack = require('webpack')

module.exports = {
  //devtool: 'cheap-module-eval-source-map',
  devtool: false,
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: __dirname
      }
    ]
  }
}


// When inside cartiv repo, prefer src to compiled version.
// You can safely delete these lines in your project.
//var cartivSrc = path.join(__dirname, '..', '..', 'lib')
////var cartivNodeModules = path.join(__dirname, '..', '..', 'node_modules')
//var fs = require('fs')
//console.log(cartivSrc);
//if (fs.existsSync(cartivSrc)/* && fs.existsSync(cartivNodeModules)*/) {
//  // Resolve cartiv to source
//  module.exports.resolve = { alias: { 'cartiv': cartivSrc } }
//  // Our root .babelrc needs this flag for CommonJS output
//  process.env.BABEL_ENV = 'commonjs'
//  // Compile cartiv from source
//  module.exports.module.loaders.push({
//    test: /\.js$/,
//    loaders: [ 'babel' ],
//    include: cartivSrc
//  })
//}
