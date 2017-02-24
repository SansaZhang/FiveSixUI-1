var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: [ './index.js' ],
  },
  output: {
    path: './dist',
	filename: 'dist.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("dist.css")
  ],
  module: {
    loaders: [{
          test: /static(\/|\\).*\.(png|gif|jpg|jpeg|woff|eot|ttf|svg)$/,
          exclude: /node_modules/,
          loader: 'file-loader?name=[path][name].[ext]'
    },{
          test: /\.woff|eot|ttf|svg$/,
          exclude: /node_modules/,
          loader: 'file-loader?name=[path][name].[ext]'
    },{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
   },{
        test: /\.less?$/,
        loaders: [ 'style', 'css-loader?modules', 'less' ] ,
        exclude: /node_modules/
    },{
        test: /\.css?$/,
        loader: "style-loader!css-loader"
    }]
  }
}
