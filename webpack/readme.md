# 常见的loader有哪些
## file-loader

如何处理webpack打包文件中的静态资源
在module对象下的rules数组中，来配置静态资源的解析规则。

```js
module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/, // 条件匹配，还可以是 include 和 exclude 三个配置来选中 loader 要应用规则的文件
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        limit: 10240,
                        outputPath: 'images/' // 将图片打包进某个具体的文件夹中
                    }
                }
            }]
    }
```
file-loader 可以limit 当 图片大小大于这个值时，将图片打包进 /images 文件夹中，当图片小于这个值时，将图片转化为base64的格式打包进js中。 这个选项可以对【最终打包的文件大小】和【减少http请求】起到一个平衡的作用。

## less-loader

如何配置 less 模块化
模块化的目的在于， 同一class 类名 互相不干扰

```js
{
                test: /\.less$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        modules: true, // 实现less 模块化
                    }
                }, 'less-loader', 'postcss-loader'],
                exclude: path.resolve(__dirname, 'node_modules')

            }
```
再将less 文件的引入方式改一下
原来是 `import './index.less'`
改为 `import style from './index.less'`

## px2rem-loader

如何实现 px2rem 在webpack 中。
webpack中可以配置 less 的解析规则 使用 px2rem-loader 和 amfe-flexible来达到这个目的

```js
{
                test: /\.less$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        modules: true, // 实现less 模块化
                    }
                }, 'less-loader', 'postcss-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75, // rem 相对 px 转换的单位，1rem = 75px
                            remPrecision: 8 // px 转化为 rem 小数点的位数
                        }
                    }
                ],
                exclude: path.resolve(__dirname, 'node_modules')
            }
```
# 常见的plugin 有哪些？

## html-webpack-plugin

最常见的是 `html-webpack-plugin` 这个plugin 主要作用是将打包后的资源包含(js,css)自动的插入最终的index.html中，并且你还能指定一个index.html 作为 template 模板，可以在 html-webpack-plugin 构造函数的配置对象中设置。
```js
plugins: [
        new htmlWebpackPlugin({
            template: './index.html',
            title: 'Hit',
            inject: true, // 可选值有 true 或者 body[所有的js资源插入到body元素的底部] head[所有js资源插入到heade元素中] false [所有的css,js 资源都不会注入到模板文件中]
            minify: false, // 是否压缩html
        })
    ]
```
## clean-webpack-plugin

清除上一次打包遗留下来的打包文件。
`clean-webpack-plugin`

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	...
	plugins: [
   new CleanWebpackPlugin()
	]
}
```

mini-css-extract-plugin：Webpack4.0 中将 css 从 bundle 文件中提取成一个独立的 css 文件；在 3.0 版本使用 extract-text-webpack-plugin。

terser-webpack-plugin：压缩 js 的插件，支持压缩 es6 代码，webpack4.0 默认使用的一个压缩插件，在 3.0 版本使用 uglifyjs-webpack-plugin 来压缩 js 代码。

copy-webpack-plugin：将文件或者文件夹拷贝到构建的输出目录

zip-webpack-plugin：将打包出的资源生成一个 zip 包

optimize-css-assets-webpack-plugin：压缩 css 代码的插件

webpack.DefinePlugin：创建一个在 编译 时可以配置的全局常量，比如设置 process.env.NODE_ENV，可以在 js 业务代码中使用。

webpack.DllPlugin：抽取第三方 js，使用 dll 打包，笔者会在之后 Webpack 性能优化将到。
## html-webpack-externals-plugin 
可以将一些公用包提取出来使用 cdn 引入，不打入 bundle 中：

# 配置 tree-shaking
能够在模块的层面上做到打包后的代码只包含被引用并被执行的模块，而不被引用或不被执行的模块被删除掉，以起到减包的效果。
在生产环境下，webpack 自动开启了 tree-shaking 无需更多的配置。

在对于 `import index.less` 或 `import '@babel/polly-fill'` 这种只有一个import 而无 export 的代码，webpack 在进行tree-shaking 时会自动忽略掉，而不进行打包，所以打包后的文件根本就没有index.less 和 @babel/polly-fill这个文件。
在 package.json文件中
```js
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "sideEffects": false, // 对所有的文件都启用 tree_shaking
  // ...
}
```
而为了配置生效，我们需要将配置改为
```js
// 在遇到碰到上面的几个模块，我们就不去进行 tree_shaking。
"sideEffects": [
  "*.less",
  "@babel/polly-fill",
]
```
## tree-shaking 的局限性
- 只能是静态声明和引用的 ES6 模块，不能是动态引入和声明的。

ES6 Module 是静态的，在代码编译阶段就能确定，模块之间的内部结构。
但是，类似这种代码在打包时会报错
```js
// webpack编译时会报错
if (condition) {
  import module1 from './module1';
} else {
  import module2 from './module2';
}
```
CommonJS   是动态的，模块的依赖关系建立在代码运行阶段。
- 只能处理模块级别，不能处理函数级别的冗余；
- 只能处理 JS 相关冗余代码，不能处理 CSS 冗余代码。



# webpack-dev-server 插件的作用
使用 http协议打开项目，项目启动的时候自动帮我们开启浏览器、指定端口起服务器等、自动帮我们刷新浏览器。

配置跨域使用proxy 选项。它的原理是使用 **http-proxy-middleware** 去把请求代理到一个外部的服务器。

解决跨域原理：上面的参数列表中有一个changeOrigin 参数, 是一个布尔值, 设置为 true, 本地就会虚拟一个服务器接收你的请求并代你发送该请求,
```js
module.exports = {
  //...
  devServer: {
    '/proxy': {
      target: 'http://your_api_server.com',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': ''
      }
    }
  }
};
```
# 不同环境下使用不同的打包配置
因为有的时候我们 开发环境 和 生产环境 的打包所要做的事情是不同的。

比如在 开发环境 中我们需要 `webpack-dev-server` 来帮我们进行快速的开发，同时需要 HMR 热更新帮我们进行页面的无刷新改动。而这些在我们的 生产环境 中都是不需要的。
讲一个具体的例子吧，不同的环境下，需要设置不同的`baseURL`。如何在打包的时候进行设置。
可以在`npm script` 脚本中配置 `process.env` 变量。
然后在 `webpack` 配置中 使用 `DefinePlugin` 这个`plugin` 将 `npm script` 中配置的变量 注入到全局中，以致于在 js 代码中可以直接获取到嗷。
```js
chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].HOST_URL = `"${argv.HOST_URL || ''}"`
      return args
    })
  }
```
# 对于webpack 与浏览器缓存如何处理
当你重新打包了，如果没做任何的配置的话，打包出来的文件，文件名还是跟之前的一模一样。
那么当你刷新浏览器重新请求文件的时候，浏览器会直接从缓存中拿，而不是重新向服务器提交请求。
解决办法在output 配置中，往输出的文件中配置 [contenthash] 占位符。 当内容改变了， [contenthash] 就会改变。对应的文件名也就改变了。

# 配置HMR (热模块替换)
# 打包ES6代码，(兼容性处理)
```js
module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'], // 还需要安装 @babel/core 
                include: path.resolve(__dirname, 'src')
            }]}
```
我们可以在项目根目录下 创建 .babelrc 文件来更好的管理 babel 的配置
```js
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

# webpack 在项目中的作用
项目构建是什么？包含哪些方面？
- 代码转换：将编译代码中的js、less、scss
- 文件优化：减少文件的大小，对文件进行压缩。(减少服务器资源占用，从而提高浏览器渲染速度)
- 代码分割：提取首页加载不需要用到的代码，让其进行异步加载
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器
- 代码校验：js 语法的检查
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统

使用 webpack + 代码部署脚本 即可实现 一键完成代码构建和项目上线。

# webpack 核心概念
- Entry：配置模块入口
- Output：配置如何输出最终想要的代码
- Module：配置处理模块的规则
- Resolve：配置寻找模块的规则
- Plugins：配置扩展插件
- DevServer：配置DevServer，就是起一个服务
- 其他配置项：其他零散的配置项
- 整体配置结构：整体的描述各配置项的结构
- 多种配置类型：配置文件不不止可以返回一个 Object，还可以返回其他格式
- 配置总结：寻找配置Webpack 的规则，减少思维负担。

# webpack 基本配置api 

## entry和ouput 是配置入口文件和打包输出文件【如何配置多页面应用?】
## Loader
由于 webpack 默认只支持js和json 的格式进行打包，对于像css,font,less,scss,图片啥的资源是无法直接进行处理的。
需要配置loader 去支持其他文件类型解析成为webpack 能够打包的模块，并可加入到依赖图中。
常用的loader 有
file-loader【用来处理图片】,
url-loader【用来处理图片】,
vue-loader【处理.vue文件】,
style-loader, css-loader, less-loader,postcss-loader

讲一个webpack 在使用Loader进行性能优化的例子。
```js
// 其中的limit 字段表示，如果图片的大小小于 所设置的值，那么该图片会转化成为base64打包进js代码中，从而减少http请求数。
module: {
  rules: [{
    test: /\.png$/,
    use: {
      loader: 'url-loader',
      options: {
        name: '[name]_[hash].[ext]',
        outputPath: 'images/',
        limit: 10240,
      }
    }
  }]
},
```
总结：loader 的作用就是对不同类型的文件进行打包
## plugins
作用是为webpack 提供额外的能力，以增强webpack,用于对bundle文件的优化，资源管理与环境变量的注入。

有类似于`vue`的生命周期，作用于webpack构建的整个流程中。

常用的plugins 
`html-webpack-plugin`:这个插件会帮助我们在 webpack 打包结束后，自动生成一个 html 文件，并把打包产生文件引入到这个 html 文件中去。
```js
// 给 webpack 添加一项配置 plugins
...
plugins: [
  new htmlWebpackPlugin({
    template: 'src/index.html', // 模板文件
  }),
]
...
```
`clean-webpack-plugin`: 这个插件能帮我们在打包之前先删除掉打包出来的文件夹。

```js
// 引入 clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

...
plugins: [
  new htmlWebpackPlugin({
    template: 'src/index.html', // 模板文件
  }),
  new cleanWebpackPlugin(),
]
...
```
## 配置sourceMap 
sourceMap 是一个映射关系，能够帮我们更好的定位源码的错误。
![source配置](https://webpack-doc-20200329.now.sh/assets/img/sourcemap4.4134342d.png)
项目开发的最佳实践：
开发环境下
```js
devtool: 'cheap-module-eval-source-map'
```
生产环境下
```js
devtool: 'cheap-module-source-map'
```
如果不想将sourceMap文件打包到最终的包里面，可以设置`devtool: 'none'`。这样可以极大的减少bundle包的体积，但是也看不了源代码了。
## 配置webpack-dev-server
我们在平时的开发过程当中，一般在我们的项目中肯定去会发一些 ajax 请求，而这个请求是基于 http 协议的，所以我们需要起一个服务器，在我们起的这个服务器中去完成我们的一系列功能开发。

这个时候就会用到 webpack-dev-derver，它有很多的参数可供我们配置，比如项目启动的时候自动帮我们开启浏览器、指定端口起服务器等、自动帮我们刷新浏览器



# 在项目中使用webpack 做根据代码所处环境动态改变项目中的baseURL
需求：可能一套代码会处于多个不同的环境，包含本地环境，测试环境，预发布环境，正式环境。每个环境，后端请求的api 地址的前缀是不一样的。
那么我们就需要让代码在不同的环境中自动的动态配置api前缀。
如何实现？
```script
npm i minimist -D
```
minimist 是个轻量级的 node.js 获取命令行参数的一个库，会将参数解析成一个字典。

因为我们的npm script 脚本命令一般是 `vue-cli-service serve --HOST_URL /api/`

那么通过 process.argv.slice(2) 就可以获取到我们需要的参数了
```js
const argv = require('minimist')(process.argv.slice(2))
```

```js
// webpack配置，将获取到的参数写到webpack的环境变量中去
// 这里的process.env就是Nodejs提供的一个API，它返回一个包含用户环境信息的对象。如果我们给Nodejs 设置一个环境变量，并把它挂载在 process.env 返回的对象上，便可以在代码中进行相应的环境判断。
 chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].HOST_URL = `"${argv.HOST_URL || ''}"`
      return args
    })
  }
```
```npm script 
    "serve": "vue-cli-service serve --HOST_URL /api/",
    "Prebuild": "vue-cli-service serve --HOST_URL /pre/api/",
    "build": "vue-cli-service serve --HOST_URL /current/",

```

```js
// 在axios 配置 baseURL 时，直接使用 process.env 中的 变量值
const instance = axios.create({
  baseURL: process.env.HOST_URL, // url = base url + request url
  timeout: 10000,
  withCredentials: false
})
```
[参考链接](https://www.jianshu.com/p/19d199f93045)
[参考链接](https://www.jianshu.com/p/231b931ab389)





# 在项目中使用到的webpack 优化配置项
- 优化打包速度
- 优化打包文件的体积
- 开启Nginx 文件对前端资源文件的gzip 压缩
- 优化首屏加载速度
# 优化打包速度
## 合理的配置mode参数与devtool参数
mode可设置`development`和 `production`两个参数
如果没有设置，**webpack4** 会将 `mode` 的默认值设置为 `production `
`production`模式下会进行`tree shaking`(去除无用代码)和`uglifyjs`(代码压缩混淆)

## 缩小文件的搜索范围(配置include exclude alias noParse extensions)
`alias`: 当我们代码中出现 `import 'vue'`时， webpack会采用向上递归搜索的方式去node_modules 目录下找。为了减少搜索范围我们可以直接告诉webpack去哪个路径下查找。也就是别名(alias)的配置。
`include`:`exclude` 同样配置`include` `exclude`也可以减少`webpack loader`的搜索转换时间。
`noParse`:当我们代码中使用到`import jq from 'jquery'`时，`webpack`会去解析`jq`这个库是否有依赖其他的包。但是我们对类似jquery这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。增加noParse属性,告诉webpack不必解析，以此增加打包速度。
`extensions`:`webpack`会根据`extensions`定义的后缀查找文件(频率较高的文件类型优先写在前面)
![webpack优化](https://user-gold-cdn.xitu.io/2019/12/13/16efe4728f877d46?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 抽离第三方模块
>对于开发项目中不经常会变更的静态依赖文件。类似于我们的elementUi、vue全家桶等等。因为很少会变更，所以我们不希望这些依赖要被集成到每一次的构建逻辑中去。 这样做的好处是每次更改我本地代码的文件的时候，webpack只需要打包我项目本身的文件代码，而不会再去编译第三方库。以后只要我们不升级第三方包的时候，那么webpack就不会对这些库去打包，这样可以快速的提高打包的速度。

[参考文献](https://juejin.im/post/6844904031240863758#heading-28)



# 优化打包的体积

## 引入webpack-bundle-analyzer分析打包后的文件
引入webpack-bundle-analyzer分析打包后的文件，看看是哪一部分占据的大部分空间，具体的进行打包体积的优化。
## externals
> 好处在于，在项目可以正常依靠`import`来使用，而又可以再最终打包的文件将其剔除出来，而在打包后的index.html 文件中使用CDN的方式去引用它，从而减少打包的体积。

比如说像`vue`, `vuex`等第三方库，本身不会经常改变，而在项目又是经常需要使用的第三方依赖库。就可以使用externals

## 取消.map文件的加载

```js
//在webpack配置中
 productionSourceMap: false,
```

这个仅仅是在开发时，生成sourceMap源文件，方便代码调试的，在正式打包的时候，可以将其关闭，减少打包后的体积。

# 优化首屏加载速度

## 路由懒加载

```js
{
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
```

## 图片懒加载

自己如何实现一个图片懒加载？

懒加载原理

图片的标签是 `img`标签，图片的来源主要是 src属性，浏览器是否发起加载图片的请求是根据是否有src属性决定的。[·](http://caibaojian.com/vue-image-lazyload.html)

所以可以从 `img`标签的 src属性入手，在没进到可视区域的时候，就先不给 img 标签的 src属性赋值，或者使用本地的图片url 地址代替，作为默认显示的一种图片。

[实现懒加载](http://caibaojian.com/vue-image-lazyload.html)

## 使用Nginx 开启gzip 文件压缩

如果你的静态资源服务器使用的是nginx ,在nginx.conf配置文件中。

```js
   gzip on;
	 gzip_min_length 1k;
	 gzip_comp_level 5;
	 gzip_buffers 4 16k;
	 gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/x
```



# 如何配置一个多页面入口的应用？






















# 你在项目中是如何做webpack优化的?

首先讲下为何要优化？减少本地开发时启动的时间，减少打包的时间，减少打包过后的体积从而提高页面的访问速度。

## 代码分片 
可以有效降低首屏加载资源的大小

### 通过入口划分代码
直接把不常变动的库的代码 写在 entry 入口处

### 使用 optimization.SplitChunks 
```js
optimization: {
    splitChunks: {
        chunks: 'all'
    }
}
```

## 什么是按需加载(资源异步加载)？

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


## 生产环境下 `webpack` 的配置

- 如何让用户更快的加载资源
- 如何压缩资源
- 如何添加环境变量优化打包
- 如何最大限度使用缓存

- 环境变量的使用(DefinePlugin)
- source map 的机制与策略 (devtool)
- 资源压缩 (mode: 'production')
- 优化hash 与 缓存 (chunkhash)
- 动态html (html-webpack-plugin)
### 环境变量的使用
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

### 压缩代码
#### 压缩js 
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
#### 压缩css
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

### DLL plugin
就是事先把常用但又构建时间长的代码提前打包好（例如 react、react-dom），取个名字叫 dll。后面再打包的时候就跳过原来的未打包代码，直接用 dll。这样一来，构建时间就会缩短，提高 webpack 打包速度。