const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
    client: path.join(__dirname, 'www', 'client'),
    dist: path.join(__dirname, 'www-dist'),
    assets: path.join(__dirname, 'www', 'client', 'assets'),
};

// Damn webpack plugins
const cleanPlugin = new CleanWebpackPlugin();
const hmrPlugin = new HotModuleReplacementPlugin();
const htmlPlugin = new HtmlWebPackPlugin({
    template: './www/client/index.html',
    filename: './index.html'
});
const copyPlugin = new CopyWebpackPlugin([
    {
        from: 'www/client/assets',
        to: 'assets'
    },
    {
        from: 'www/client/favicon.ico',
        to: 'favicon.ico'
    }
]);

module.exports = {
    entry: './www/client/index.tsx',
    output: {
        path: PATHS.dist,
        filename: '[name].js'
    },
    plugins: [
        cleanPlugin,
        hmrPlugin,
        htmlPlugin,
        copyPlugin,
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            // Scripts
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // (typed) Scripts
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            // Styles
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg|ttc|woff)$/i,
                use: [
                    {
                        loader: 'file-loader'
                    }
                    // 'file-loader',
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         // disable: true, // webpack@2.x and newer
                    //     },
                    // },
                ],
            }
        ]
    }
};