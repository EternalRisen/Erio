const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
    client: path.join(__dirname, 'www', 'client'),
    dist: path.join(__dirname, 'www-dist'),
    assets: path.join(__dirname, 'www', 'public', 'assets'),
};

// Damn webpack plugins
const cleanPlugin = new CleanWebpackPlugin();
const copyPlugin = new CopyWebpackPlugin([
    {
        from: 'www/public',
        to: ''
    },
    {
        from: 'www/public/index.html',
        to: ''
    },
    {
        from: 'www/public/commands.html',
        to: ''
    }
]);

module.exports = {
    target: 'node',
    // entry: ['./www/client/index.tsx', './www/client/commands.tsx'],
    entry: {
        index: './www/client/index.tsx',
        commands: './www/client/commands.tsx',
        users: './www/client/users.tsx'
    },
    output: {
        path: PATHS.dist,
        filename: '[name].js'
    },
    plugins: [
        cleanPlugin,
        copyPlugin,
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            commands: path.resolve(__dirname, 'src-dist/plugins/commands')
        }
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