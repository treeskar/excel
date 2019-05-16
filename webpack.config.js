const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new FaviconsWebpackPlugin({
    //   logo: path.resolve(__dirname, 'src/assets/favicon.svg'),
    //   persistentCache: true,
    //   inject: true,
    //   icons: {
    //     favicons: true,
    //     firefox: false,
    //     opengraph: false,
    //     twitter: false,
    //     yandex: false,
    //     windows: false
    //   }
    // }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Excel',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 8080
  },
};