
var path = require('path')
var webpack = require('webpack')
var UglifyJSPlugin = webpack.optimize.UglifyJsPlugin
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

var config = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    library: 'RuntimeImport',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../.package'),
    filename: 'runtime-import.min.js',
    umdNamedDefine: true
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new UglifyJSPlugin({
      mangle: {
        // Skip mangling these
        except: ['$super', '$', 'exports', 'require']
      },
      sourceMap: true
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'BundleReport.html',
      logLevel: 'info'
    })
  ]
}

module.exports = config
