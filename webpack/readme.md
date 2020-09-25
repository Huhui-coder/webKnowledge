# 在项目中使用到的webpack 优化配置项
- 优化打包速度
- 优化打包文件的体积
- 开启Nginx 文件对前端资源文件的gzip 压缩
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

## 组件异步加载

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


