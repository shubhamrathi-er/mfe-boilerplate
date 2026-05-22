import HtmlWebpackPlugin from "html-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced";

export default {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: {
                  "@tailwindcss/postcss": {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        appDashboard: "appDashboard@http://localhost:3001/remoteEntry.js",
        appSettings: "appSettings@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};