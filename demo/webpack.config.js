var webpack = require('webpack');
var path = require('path')

module.exports = {
    entry : {
        index: [ path.join(__dirname, './client/static/js/index.js') ],
    },
    output : {
        path : __dirname + '/output/js/',
        filename : '[name].bundle.js',
        publicPath: '/resource/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
        alias: {
            "fivesix": path.join(__dirname, '../components')
        }
    },
    resolveLoader: { root: path.join(__dirname, "../node_modules") },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
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
          loader: "style!css"
        }]
    }
}
