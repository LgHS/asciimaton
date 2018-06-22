const {resolve} = require('path');
const webpack = require('webpack');
const DefinePlugin = webpack.DefinePlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: resolve(__dirname, '../src'),
  entry: [
    'babel-polyfill',
    './ui/scripts/main.js'
    // the entry point of our app
  ],
  output: {
    filename: 'main.js',
    path: resolve(__dirname, '../../py-middleware/static/ui')
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader',],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
              use: [
                {
                  loader: "css-loader" // translates CSS into CommonJS
                },
                {
                  loader: "sass-loader" // compiles Sass to CSS
                }
              ],
              // use style-loader in development
              fallback: "style-loader"
            }
        )
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: 'file-loader?name=[name].[ext]&outputPath=fonts/'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=[name].[ext]&outputPath=images/&publicPath=static/ui/',
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new UglifyJsPlugin({
      sourceMap: false
    }),
    new ExtractTextPlugin({filename: 'styles.css', allChunks: true})
  ],
};
