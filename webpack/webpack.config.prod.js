const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const merge = require("webpack-merge");
const path = require("path");

const configCommon = require("./webpack.config.common");
const paths = require("./paths");

module.exports = merge.smart(configCommon, {
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
          mangle: {
            // for details see https://github.com/ethereum/web3.js/issues/1356
            reserved: ["BigNumber"],
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
      new webpack.HashedModuleIdsPlugin(),
    ],
  },
  output: {
    filename: "[chunkhash].[name].min.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[contenthash].[name].css",
    }),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.module.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  importLoaders: 3,
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  config: {
                    path: path.join(__dirname, "postcss.config.js"),
                  },
                },
              },
              {
                loader: "sass-loader",
              },
              {
                loader: "sass-resources-loader",
                options: {
                  resources: [path.join(__dirname, "../app/styles/neufund-theme.scss")],
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  importLoaders: 2,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  config: {
                    path: path.join(__dirname, "postcss.config.js"),
                  },
                },
              },
              {
                loader: "sass-loader",
              },
            ],
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
              },
            ],
          },
          {
            test: /\.(tsx?)$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  configFile: "tsconfig.json",
                },
              },
            ],
            include: paths.app,
          },
        ],
      },
    ],
  },
});
