// module.exports = {
//   chainWebpack: config => {
//     /* disable insertion of assets as data urls b/c Phaser doesn't support it */
//     const rules = [
//       { name: 'images', dir: 'img' },
//       { name: 'media',  dir: 'media' }
//     ]
//     rules.forEach(rule => {
//       const ruleConf = config.module.rule(rule.name)

//       ruleConf.uses.clear()

//       ruleConf
//         .use('file-loader')
//           .loader('file-loader')
//           .options({
//             name: `${rule.dir}/[name].[hash:8].[ext]`
//           })
//     })
//   },
//   devServer: {
//     hot: false
//   }
// }

const isDev = process.env.NODE_ENV === "development";

const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: isDev ? "development" : "production",
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/public/",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devtool: "source-map",
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
};
