var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../demo/index.js'),
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'index.js',
    publicPath: '/'
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader'
      },

      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!less-loader'
      },

      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'demo/index.html'
    })
  ],

  devServer: {
    hot: true,
    port: 9000
  }
}
