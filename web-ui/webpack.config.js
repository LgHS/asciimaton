const {resolve} = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: [
      'babel-polyfill',
    './scripts/main.js'
  ],
  output: {
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: [
                {
                  loader: "css-loader" // translates CSS into CommonJS
                },
                {
                  loader: "sass-loader" // compiles Sass to CSS
                }
              ],
              fallback: "style-loader" // used when css not extracted
            }
        ))
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=[name].[ext]&outputPath=images/',
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new ExtractTextPlugin({filename: 'styles.css', allChunks: true})
  ],
}
;