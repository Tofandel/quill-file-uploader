const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [{
  entry: {
    'dist/fileUploader': './src/main.js',
    'demo/demo': './src/demo/demo.js',
  },
  output: {
    library: 'fileUploader',
    libraryTarget: 'umd',
    filename: '[name].js',
    path: __dirname,
  },
  devServer: {
    // contentBase: './src',
    https: true,
  },
  externals: {
    quill: {
      root: 'Quill',
      commonjs: 'quill',
      commonjs2: 'quill',
      window: 'Quill'
    },
    'quill-file-uploader': 'fileUploader'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          compress: {
            drop_console: false,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    ],
  },
  plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin({
    template: './src/demo/demo.html',
    filename: 'demo/demo.html'
  })],
}];
