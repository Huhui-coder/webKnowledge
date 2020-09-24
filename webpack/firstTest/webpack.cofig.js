const path = require('path')

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './dist')
    },
    devServe: {
        publicPath: './dist'
    }
}