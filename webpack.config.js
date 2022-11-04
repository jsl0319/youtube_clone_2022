const path = require('path')

module.exports = {
    mode: 'development',
    entry: { index: path.resolve(__dirname, 'src', 'init.js') },
    debServer: { port:4000 },
    module: {
        rules: [
            {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            },
            },
        ],
    },
}