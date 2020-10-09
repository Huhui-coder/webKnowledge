
// 如何快速找出一个数组中的最大最小值？
// 使用Math.max 和 Math.min 借助apply 即可快速实现。
// const numbers = [1,2,3,4,5,6,7,8,9]
// const max = Math.max.apply(null, numbers)
// const min = Math.min.apply(null, numbers)

// 当然你要用比较low  的循环方式也是可以解决这个问题的
var numbers = [1,2,3,4,5,6,7, 10, 100]
var max = 0
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < numbers[i+1]) max = (numbers[i+1])
}


// 实现 (5).add(2).mins(2) === 1
// 关键在于实现链式调用，以及将方法挂载到原型链上
// 实现链式调用 =》 在函数的末尾返回这个this 实例对象
/**
 *检验参数
 *
 * @param {*} n
 * @returns
 */
// function check(n) {
//     n = Number(n);
//     return isNaN(n) ? 0 : n;
// }
// function add(n) {
//     n = check(n)
//     return this + n
// }
// function mins(n) {
//     n = check(n)
//     return this - n 
// }
// Number.prototype.add = add;
// Number.prototype.mins = mins

// console.log((2).add(3).mins(2))  // 3


// 大小写转换,
// 一种写法，使用replace函数，利用正则匹配到每一个字符串，回调函数中对每一个字符串进行判断，
// 如果这个字符串变为大写之后还跟原来一样，那么它本来就是大写，我们将其变为小写
// 如果这个字符串变为大写之后不跟原来一样，那么它本来是小写，我们将其变为大写
// 第二种写法利用charCodeAt()方法 判断ACkII 编码 数字大小  65- 90 之间为大写字母
// var str = 'sisdji78UIHIHIHiHIt'
// str = str.replace(/[a-zA-Z]/g, content => {
//     // return content.toUpperCase() === content ? content.toLowerCase() : content.toUpperCase()
//     if (content.charCodeAt() >= 65 && content.charCodeAt() <= 90) {
//         content = content.toLowerCase()
//     } else {
//         content = content.toUpperCase()
//     }
//     return content
// })

// console.log(str)

// 实现一个字符串匹配算法，从字符串s当中查找是否存在字符串t,如果存在返回所在的索引，不存在返回-1。(不能使用indexOf/includes等内置方法)
// 简单来说就是实现一个indexOf()

// 法一：使用循环
// var t = 'ii';
// var s = 'saiisssasass';

// function _indexOf(t) {
//     var index = -1,
//         sLen = this.length,
//         tLen = t.length;
//     if (tLen > sLen) return -1;
//     for (let i = 0; i <= sLen - tLen; i++) {
//         if (this.substr(i, tLen) === t) {
//             index = i;
//             break;
//         }
//     }
//     return index
// }
// String.prototype._indexOf = _indexOf

// var a = s._indexOf(t)
// console.log(a)

// 法二：使用正则表达式

var t = 'ii';
var s = 'saiisssasass';

function _indexOf(t) {
    let reg = new RegExp(t),
        res = reg.exec(this);
    return res === null ? -1 : res.index
}
String.prototype._indexOf = _indexOf

var a = s._indexOf(t)
console.log(a)
