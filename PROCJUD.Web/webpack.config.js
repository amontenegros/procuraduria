const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = env => {

    let plugins = [];

    if (env.NODE_ENV === 'production') {
        plugins.push(new UglifyJsPlugin({
            sourceMap: false
        }));
    }

    const watch = (env.NODE_ENV === 'production' ? false : true);

    return {
        module: {
            rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                        plugins: ['transform-class-properties', 'transform-object-rest-spread']
                    }
                },
                {
                    test: /\.(scss|css)$/,

                    use: [{
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }
            ]
        },

        resolve: {
            extensions: ['.js', '.jsx']
        },

        plugins: plugins,

        entry: {
            "main": ["babel-polyfill", './src/index.jsx'],
        },

        output: {
            //filename: '[name].[chunkhash].js',
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, './Scripts/dist')
        },
        devtool: 'source-map',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all"
                    }
                }
            }
        },

        watch: watch,

        mode: 'development'
    }
};