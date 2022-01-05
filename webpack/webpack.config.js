const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const browserConfig = {
  name: 'client',
  entry: {
    main: path.join(__dirname, '../client/index.tsx'),
  },
  output: {
    path: path.join(__dirname, '../build'),
    publicPath: '/',
    filename: !isProd ? '[name].js' : '[hash].js',
  },
  devtool: !isProd ? 'source-map' : false,
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProd,
              import: false,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /server/, /client_dist/, /server_dist/],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), 'client/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: !isProd ? 'main.css' : '[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

const serverConfig = {
  name: 'server',
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  entry: {
    server: path.join(__dirname, '../server/index.ts'),
  },
  output: {
    filename: 'server.js',
    path: path.join(__dirname, '../build'),
    libraryTarget: 'commonjs2',
  },
  watch: !isProd,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['node_modules'],
  },
  externals: [
    'mongodb-client-encryption',
    'snappy/package.json',
    'aws4',
    'snappy',
    'kerberos',
    'bson-ext',
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.s?css$/,
        loader: 'ignore-loader',
      },
      {
        test: /\.(scss|ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'ignore-loader',
      },
    ],
  },
};

const exportsModule = isProd ? [browserConfig, serverConfig] : [browserConfig];

module.exports = exportsModule;
