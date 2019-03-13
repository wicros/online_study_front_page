const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.join(__dirname, './src/main.js')
    ]
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "main.[hash:7].js",
    publicPath: "/"
  },
  devServer: {
    hot: true,
    open: true,
    port: 8000,
    host: "0.0.0.0"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./src/index.html"),
      filename: "index.html",
      inject: true,
      favicon: path.join("./favicon.ico")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "static"),
        to: "./static"
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.config.js$/,
        use: "raw-loader"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      { test: /\.vue$/, use: "vue-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          name: "images/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[hash:7].[ext]"
        }
      },
    ]
  },
  mode: "development",
  devtool: isProd ? false : 'inline-source-map'
};
