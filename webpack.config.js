const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = [{
  entry: {
    'dist/imageUploader': './src/main.js',
    'demo/demo': './src/demo.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname,
  },
  devServer: {
    // contentBase: './src',
    https: true,
  },
  externals: {
    quill: 'Quill',
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
  plugins: [new MiniCssExtractPlugin()],
}];
