# 不同的模块和他们之间的标准

- commmon.js
- ES6 Module
## common.js
使用require()引入文件资源
```js
// ./calculator.js
var name = calculator

// ./index.js
var name = 'index.js'
require('./calculator')
console.log(name) // index.js
```
使用 common.js 标准引入的模块资源，使用require()引入资源时，并不会污染全局作用域。而直接使用script src 属性引入的资源会直接影响到全局作用域。

使用module.exports 导出一个文件资源

```js
//  ./calculator 导出
module.exports = {
    name: 'hit',
    add: function (a, b) {
        return a + b
    }
}
// 使用
const calculator = require('calculator')
consoel.log(calculator.name) // hit
consoel.log(calculator.add(1, 2)) //3
```
CommonJS模块内部会有一个module对象用于存放当前模块的信息,可以理解成在每个模块的最开始定义了一下对象、
```js
var module = {...} 

//模块自身逻辑
module.exports = {...}
```
`module.exports` 用来指定模块要对外暴露哪些内容。
也可以使用`exports.name = 'hit'`的方式来快捷导出。
在实现效果上, 跟上面的代码没有任何的不同。其内部的机制是将`export 指向了 module.exports`。而module.exports 初始化的时候是一个空对象.
相当于
` var module = { exports = {} } exports = module.exports `
要在exports 的基础上 添加属性或方法，才是正确的导出。如果你使用的是 `exports = {name: 'hit'}` 那么会导致 原来的 module.exports 导出的还是空对象，导出无效。
另外，也不要混合着用。
```js
exports.add = function (a,b) {
    return a+b
}
module.exports = {
    name: 'hit'
}
```
这样做，实际上导出的还只是有 name.后面 module.exorts 重新赋值给了一个新对象，把原来的exports导出的漏掉了。其实，本质上就是一个对象引用上的问题。
另外，`module.exports` 并不代表模块的末尾，位于 `module.exports`后面的代码还是会执行的。

在CommonJS使用require 进行模块的导入。
```js
// calculator.js
module.exports = {
    add: function (a, b) {
        return a + b
    }
}
// index.js
const calculator = require('./calculator.js')
const sum = calculator.add(1,2)
console.log(sum) // 3
```
当我们在require 一个模块的时候，会有两种情况
- require 是第一次被加载。这时会首先执行该模块，然后导出内容
- require 曾经被加载过，那么不会再次执行该模块, 而是直接导出上次执行后的结果。

```js
// calculator.js
console.log('i am calculator.js')
module.exports = {
    name: 'hit',
    add: function (a, b) {
        return a + b
    }
}
// index.js
const calculator = require('./calculator.js') // 第一次加载，calculator.js 会执行
const sum = calculator.add(1,2)
console.log(sum) // 3
const moduleName = require('./calculator.js').name // 第二次加载calculator.js 不会执行
console.log('end')
```
控制台会输出:  
```js
i am calculator.js 
3
end
```
我们前面提到，模块中会有一个module对象来存储其信息，这个对象有个`loaded` 属性，用于记录该模块是否被加载，初始化的值为 false ， 当模块第一次加载并被执行过后，其值变为 `true`, 后面再加载模块，而不会再执行模块代码了。
## ES6 Module
```js
// calculator.js
export default {
    name: 'hit',
    add: function (a, b) {
        return a + b
    }
}

//  index.js
import calculator from './calculator.js'
const sum = calculator.add(2, 3)
console.log(sum)
```

导出
- 命名导出
- 默认导出
## 命名导出
```js
// 单个导出
export const name = 'calculator'
export const add = function (a, b) { return a + b}
```
```js
// 统一导出
const name = 'calculator'
const add = function (a, b) { return a + b} 
export { name, add }

// 对应导入写法
import { name, add } from './calculator.js'
add(2,3)
```


使用as 对变量进行重命名， 以`as` 后面的命名作为最终的命名。
```js
const name = 'calculator'
const add = function (a, b) { return a + b} 
export { name, add as getSum } // 导出即变为name 和 getSum
// 对应导入
import { name, getSum as add } from './calculator.js' // 导入变为 add()
add(2,3)
```
## 默认导出
默认导出只能有一个
```js
export default {
    name: 'calculator',
    add: function (a, b) { return a + b}
}
```

我们可以将 export default 理解为对外输出了一个名为default 的变量，因此不需要像命名导出时进行变量声明，直接导出值即可。
` export default 'This is calculator.js'`
` export default class {...}`
` export default function () {...}`

导入
在导入多个变量时，我们还可以采用整体导入的方式，

```js
import * as calculator from './calculator.js'
console.log(calculator.add(2, 3))
console.log(calculator.name)
```
使用 import * as <myModule> 可以把所有导入的变量作为属性值添加到<myModule>对象中， 从而减少对当前作用域的影响。

最后来看下默认导出。
```js
export default {
    name: 'calculator',
    add: function (a, b) { return a + b}
}
// index.js
import myCalculator from './calculator';
myCalculator.add(2, 3)
```
对于默认导出来说，import 后面直接跟变量名，并且这个变量名可以任意指定，它指代了calculator.js 中默认导出的值。从原理上可以这样去理解。
`import { default as myCalculator } from './calculator'`

复合写法
`export { name, add } from './calculator.js'`
把一个模块导入后立即导出，就可以这么写，只支持命名导出。

## 二者之间的区别。

### 动态与静态
CommonJS 是动态的，模块的依赖关系建立在代码运行阶段。
ES6Module 是静态的，模块的依赖关系建立在代码编译阶段。

CommonJS 的模块路径可以动态指定，支持传入一个表达式，我们甚至可以通过if 语句判断是否加载某个模块。因此在CommomJS模块被执行前，并没有办法明确依赖关系，模块的导入，导出发生在代码的运行阶段。

ES6Module在代码的编译阶段就可以分析出模块的依赖关系。它相对于CommonJS来说具备以下优势。
- 死代码的检测和排除、我们可以用静态分析工具检查出哪些模块是没有被调用过的，从而在编译打包的时候，将没使用的代码去除掉，减少打包的资源。
- 编译器优化，CommonJS本质上是导入一个对象，ES6 Module支持导入变量，减少了引用层级，程序效率更高。

### 值拷贝和动态映射

在导入一个模块时，对于CommomJS来说获取的是一份导出值的拷贝；而在ES6Module中则是值的动态映射，并且这个映射是只读的。


### 循环依赖

CommomJS 不支持循环依赖，简单一句话，因为CommonJS的模块化是遵循值的拷贝，当你循环依赖的时候，(在a.js)最初使用require()导入一个模块的时候会首先执行那个模块(b.js)，执行的这个模块又依赖的使用它的模块(a.js)，导致循环依赖，但是此时，执行权还在(b.js)的手上。b.js直接获取到的是`module.exports`这个导出的**空对象**。(b.js)执行完毕。控制权回到a.js手上。



ES6 Module 支持循环依赖，简单一句话，因为ES6 Module的模块化是支持值的动态映射的。



## 总结:

CommonJS 和 ES6 Module 是目前使用较为广泛的模块标准。它们的主要区别在于前者建立模块依赖关系是在运行时，后者是在编译时；在导入模块方面，CommonJS导入的是值拷贝，ES6 Module 导入的是只读的变量映射；ES6 Moudle通过其静态特性可以进行编译过程中的优化，并且具备处理循环依赖的能力。

[参考链接](https://juejin.im/post/6844904137159606285)









