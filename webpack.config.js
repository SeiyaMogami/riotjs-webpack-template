const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    login: "./src/entries/login.js"
    //, other: "./src/entries/other.js"
  },
  output: {
    filename: 'js/[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      riot: 'riot'
    }),
    // JSのMinify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.tag.html'],
    alias: {
      config: path.join(__dirname, 'config', process.env.NODE_ENV + '.json')
    }
  },
  module: {
    preLoaders: [{
      test: /\.tag.html$/,
      exclude: /node_modules/,
      loader: 'tag-loader',
      query: {
        type: 'none',
        ext: 'tag.html'
      }
    }],
    loaders: [{
        test: /\.js$|\.tag.html$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015-riot']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
