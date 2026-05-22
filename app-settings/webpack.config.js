import HtmlWebpackPlugin from "html-webpack-plugin";
import { ModuleFederationPlugin } from "@module-federation/enhanced";

const isProd = !!process.env.VERCEL_URL;
const PUBLIC_URL = isProd
  ? "https://mfe-settings-iota.vercel.app"
  : "http://localhost:3002";

export default {
  mode: isProd ? "production" : "development",
  entry: "./src/index.ts",
  output: {
    publicPath: `${PUBLIC_URL}/`,
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
      name: "appSettings",
      filename: "remoteEntry.js",
      exposes: {
        "./Settings": "./src/App",
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
    port: 3002,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};