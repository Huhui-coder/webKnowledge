代码分片 可以有效降低首屏加载资源的大小

通过入口划分代码
- 直接把不常变动的库的代码 写在 entry 入口处

使用 optimization.SplitChunks 
```js

optimization: {
    splitChunks: {
        chunks: 'all'
    }
}
```

什么是按需加载(资源异步加载)？

当模块数量过多，资源体积过大，可以把一些暂时不用的资源进行延迟加载。这样做的效果是，在页面初次渲染的时候用户下载的资源是很小的，后续的模块等到恰当的时机再去触发加载。

在webpack 中  我们可以使用 `import()`进行异步加载。 
**注意webpack 中的 import 与 ES6 module 中的 import 是不同的**
在`webpack`中通过`import()` 函数加载的模块及其依赖会被异步地进行加载，并返回一个异步对象。
```js
// foo.js
import('./bar.js').then(({ add }) => {
    console.log(add(2, 3))
})

// bar.js
export function add (a, b) {
    return a+ b
}
```


在生产环境的 `webpack` 配置

- 如何让用户更快的加载资源
- 如何压缩资源
- 如何添加环境变量优化打包
- 如何最大限度使用缓存

- 环境变量的使用
- source map 的机制与策略
- 资源压缩
- 优化hash 与 缓存
- 动态html

npm script 脚本的使用
- 可以在脚本中输入变量, 在webpack 中，进行使用
- 可以为webpack 配置不同的打包配置文件 使用 --config 

```js
// 在 npm script 配置变量

"script" : {
    "dev": " ENV=development webpack-dev-server",
    "build": "ENV=production webpack"
}

// webpack.config.js

cost ENV = process.env.ENV 
const isProd = ENV === 'production'
module.exports = {
    output: {
        filename: isProd ? 'budle@[chunkhash].js': 'bundle.js'
    },
    mode: ENV
}
```
```js
// 配置不同的配置文件进行打包，
"script" : {
    "dev": "webpack-dev-server --config=webpack.development.config.js",
    "build": "webpack --config=webpack.production.config.js"
}

// 新建一个 webpack.common.js 存储公共的webpack配置， 然后再使用 webpack-merge 插件 进行配置合并。
```
环境变量的设置
我们可以通过 `DefinePlugin` 插件来进行环境变量的设置，然后在 js 代码中使用。
```js
plugins: [
    new webpack.DefinePlugin({
        ENV: JSON.stringify('production')
    })
]
// app.js
document.write(ENV)
```

讲讲什么是 `process.env` 
process.env 是Node.js 存放当前进程环境变量的对象，而NODE_ENV 则可以让开发者指定当前的运行环境。

当我们在webpack 中指定了 mode: 'production', 那么 process.env.NODE_ENV 的值默认就是  production , 不需要人为去配置了。

讲讲什么是 `source map`
source map 是指将编译，打包，压缩后的代码映射回源代码的过程。
它的工作原理: 在 `devtool`选项中开启source map之后，在每个对应的打包后的budle 文件同目录下，都会有一个 以文件名.map 文件， map文件存储的转换前的源码位置。通过.map文件，我们就能找到对应的源码位置，从而进行调试。
再来看看 对应的 `devtool`选项的其他几个备选项。
- cheap-source-map
- eval-source-map
- none

推荐使用 `cheap-source-map`, 因为生成完整的source map 也是一个比较耗费时间和资源的事情，`cheap-source-map`是一个较为折中的方案。

压缩代码
压缩js 
```js
// 注意： 如果已经开启了 mode: production,无需配置，默认开启。
module.exports = {
    entry: './app.js',
    output: {
        filename: isProd ? 'budle@[chunkhash].js': 'bundle.js'
    },
    optimization: {
        minimize: true
    }
}
```
压缩css
前提是使用  `extract-text-webpack-plugin`或者`mini-css-extract-plugin`将样式提取出来，接着使用`optimize-webpack-plugin`来进行压缩。
```js
const ExtractTextPlugin = require('extract-text-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    // ...
    module: {
        rules: [
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        ]
    }
},
plugins: [new OptimizeCSSAssetsPlugin({
    // 生效范围，只压缩到匹配的资源
    assetNameRegExp: /\.optimize\.css$/g,
    // 压缩处理器，默认为 cssnano
    cssProcessor: require('cssnano'),
    // 压缩处理器的配置
    cssProcessorOptions: { discardComments: { removeAll: true }},
    canPrint: true,
})]
```

DLL plugin
就是事先把常用但又构建时间长的代码提前打包好（例如 react、react-dom），取个名字叫 dll。后面再打包的时候就跳过原来的未打包代码，直接用 dll。这样一来，构建时间就会缩短，提高 webpack 打包速度。

