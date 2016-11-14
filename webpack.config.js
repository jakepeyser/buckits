/* eslint-disable no-unused-vars*/
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const tools = require('./libs/webpack.tools');
const pkg = require('./package.json');

// Init common paths used by config
const path = require('path');
const PATHS = {
  app: path.join(__dirname, 'browser/react'),
  build: path.join(__dirname, 'browser/build'),
  stylesheets: path.join(__dirname, 'browser/src/stylesheets', 'style.css'),
  favicon: path.join(__dirname, 'browser/src/favicon.ico'),
  logo: path.join(__dirname, 'browser/src/images/logo.png'),
  html_template: path.join(__dirname, 'browser/src/index.html')
};

// Generate image file locations in an array
const IMAGE_PATHS = [ PATHS.logo ];

// Vendor dependencies, isolated for chunking
const vendorDependencies = [
  'axios',
  'react', 'react-dom', 'react-helmet', 'react-router', 'react-gmaps',
  'redux', 'react-redux', 'redux-logger', 'redux-thunk'
]

// index.html template
let htmlTemplate = {
  title: 'Buckits',
  meta: {
    description: 'Helping you complete your bucket list, drop by drop',
    author: 'Jake Peyser',
    keywords: 'bucket list, goals, travel, education'
  },
  template: PATHS.html_template
}

// Standard build artifacts for all envs
const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.stylesheets,
    images: IMAGE_PATHS
  },
  output: {
    path: PATHS.build,
    sourceMapFilename: '[file].map',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  module: {
    loaders: [
      {
        test: /jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
}

// Detect how npm is run and switch based on this
let config;
switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: Object.assign(common.output, {
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }),
        plugins: [
          ...common.plugins,
          new FaviconsWebpackPlugin({
            logo: PATHS.logo,
            emitStats: false
          }),
          new HtmlWebpackPlugin(htmlTemplate)
        ]
      },
      tools.extractBundle({
        name: 'vendor',
        entries: vendorDependencies
      }),
      tools.clean(PATHS.build),
      tools.extractCSS(PATHS.stylesheets),
      tools.extractImages(PATHS.images),
      tools.minify()
    );
    break;
  case 'stats': // Used to generate stats to stats.json
  case 'build-watch':
    htmlTemplate.favicon = PATHS.favicon;
    config = merge(
      common,
      {
        devtool: 'eval',
        plugins: [
          ...common.plugins,
          new HtmlWebpackPlugin(htmlTemplate)
        ]
      },
      tools.clean(PATHS.build),
      tools.extractCSS(PATHS.stylesheets),
      tools.extractImages(PATHS.images)
    );
    break;
  default:
    console.log('No Webpack config specified')
    config = merge(common)
}

module.exports = validate(config, { quiet: true });
