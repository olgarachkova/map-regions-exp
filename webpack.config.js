const webpack = require('webpack');

const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require('dotenv');

const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const path = require('path');

let entries = {
    'index': './src/front/index.tsx',
}

dotenv.config();
const environmentVariables = [
    "PORT",
];

module.exports = {
    mode: 'development',
    entry: entries,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.json'
                }
            },
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: require.resolve('resolve-url-loader'), // apparently need to be exactly here 
                        options: {
                            sourceMap: true,
                            // root: paths.appSrc, // ? should be undefined
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.module\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: { getLocalIdent: getCSSModuleLocalIdent }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: "[name].[ext]",
                    outputPath: "./assets",
                    esModule: false
                }
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dst/front/'),
        devtoolModuleFilenameTemplate(info) {
            return `file:///${info.absoluteResourcePath.replace(/\\/g, '/')}`;
        },
    },
    devtool: 'source-map',
    devServer: {
        port: 9000
    },
    optimization: {
        minimize: !true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "styles",
                    type: "css/mini-extract",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "front/*.html", context: path.resolve(__dirname, "src"), to: path.resolve(__dirname, "dst") }, // only for isolate 
            ],
        }),
        new MiniCssExtractPlugin({
            filename: './style.css',
        }),
        new webpack.EnvironmentPlugin(environmentVariables),
    ],
};