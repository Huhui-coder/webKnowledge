# 我们为何需要ts?
因为JavaScript是弱类型, 很多错误只有在运行时才会被发现,而TypeScript是强类型,它提供了一套静态检测机制,如果我们编码中途变换变量的类型,ts就会在报错,帮助我们在编码时发现错误。

# TypeScript 的特点
- TypeScript 只会在编译阶段对类型进行静态检查，如果发现有错误，编译时就会报错。而在运行时，编译生成的 JS 与普通的 JavaScript 文件一样，并不会进行类型检查。
- 支持最新的JavaScript新特特性
- 支持代码静态检查
- 支持诸如C,C++,Java,Go等后端语言中的特性(枚举、泛型、类型转换、命名空间、声明文件、类、接口等)

# ts 的数据类型
## ts 的基本数据类型
```ts
boolean、number、string简单类型的变量声明
let val2:boolean;
let val1:number;
let val3:string;
```
## 数组和元祖类型的变量声明

```ts
(1)整个数组数据类型一致的情况
方式一: Array <number>
// 需求: 要求定义一个数组, 这个数组中将来只能存储数值类型的数据
let arr1:Array<number>; // 表示定义了一个名称叫做arr1的数组, 这个数组中将来只能够存储数值类型的数据
arr1 = [1, 3, 5];
// arr1 = ['a', 3, 5]; // 报错
console.log(arr1);

方式二: string[ ] （建议）
// 需求: 要求定义一个数组, 这个数组中将来只能存储字符串类型的数据
let arr2:string[]; // 表示定义了一个名称叫做arr2的数组, 这个数组中将来只能够存储字符串类型的数据
arr2 = ['a', 'b', 'c'];
// arr2 = [1, 'b', 'c']; // 报错
console.log(arr2);

(2)整个数组数据类型不一致的情况
联合类型声明数组 (number | string)[ ]
let arr3:(number | string)[];
// 表示定义了一个名称叫做arr3的数组, 这个数组中将来既可以存储数值类型的数据, 也可以存储字符串类型的数据
arr3 = [1, 'b', 2, 'c'];
// arr3 = [1, 'b', 2, 'c', false]; // 报错
console.log(arr3);

(3) 自由任意类型元素的数组 any[ ]
let arr4:any[]; // 表示定义了一个名称叫做arr4的数组, 这个数组中将来可以存储任意类型的数据
arr4 = [1, 'b', false];
console.log(arr4);

(4) 严格限制类型和长度的元祖数组
元祖类型 [string, number, boolean]
let arr5:[string, number, boolean]; 

// 表示定义了一个名称叫做arr5的元祖, 这个元祖中将来可以存储3个元素, 第一个元素必须是字符串类型, 第二个元素必须是数字类型, 第三个元素必须是布尔类型

arr5 = ['a', 1, true];
// arr5 = ['a', 1, true, false]; // 超过指定的长度会报错
arr5 = ['a', 1, true];
console.log(arr5);
```
```ts
// enum Gender {
//     Male = 0,
//     Femal = 1
// }

// 默认是从0开始递增的，所以不写也没关系。
// enum Gender {
//     Male,
//     Femal
// }

// 你可以改变其中一项的值，前面还是默认递增的不受影响。
// enum Gender {
//     Male,
//     Femal = 9
// }
// 但是， 你改变了之前项的值，那么后面的递增的会在前面值的基础上进行递增。
enum Gender {
    Male = 9,
    Femal
}


let val: Gender

val = Gender.Male
console.log(val)

```

**对于 enum 类型 除了支持从成员名称到成员值之外，还支持从成员值到成员名称之间的映射。**

```ts
enum Direction {
    NORTH,
    SOURTH,
    EAST,
    WEST
}

let dirName = Direction[0] // "NORTH"

let dirValue = Direction["NORTH"]  // 0

```
## any
当你不知道返回什么类型的时候，就可以写 any 了

## void
表示 没有任何类型，一般用于函数的返回值。在TS中只有null和undefined可以赋值给void类型
```ts
function test():void {
    console.log("hello world");
}
test();

let value:void; // 定义了一个不可以保存任意类型数据的变量, 只能保存null和undefined
// value = 123; // 报错
// value = "abc";// 报错
// value = true;// 报错
// 注意点: null和undefined是所有类型的子类型, 所以我们可以将null和undefined赋值给任意类型
// value = null; // 不会报错
value = undefined;// 不会报错

```
## never 
表示的是那些永不存在的值的类型,一般用于抛出异常或根本不可能有返回值的函数。
```ts
// function demo():never {
//     throw new Error('报错了');
// }
// demo();

// function demo2():never {
//     while (true){}
// }
// demo2();

```

## Object
```ts
let obj:object; // 定义了一个只能保存对象的变量
// obj = 1;
// obj = "123";
// obj = true;
obj = {name:'lnj', age:33};
console.log(obj);

```

## interface 
表示一个具体的对象的数据结构
```ts
// 需求: 要求定义一个函数输出一个人完整的姓名, 这个人的姓必须是字符串, 这个人的名也必须是一个字符

interface FullName{
    firstName:string
    lastName:string
}

let obj: FullName = {
    firstName:'Jonathan',
    lastName:'Lee'
    // lastName:18 会报错
};

//{firstName, lastName}使用了解构赋值, 还可以用在函数的参数定义上面。
function say({firstName, lastName}:FullName):void {
    console.log(`我的姓名是:${firstName}_${lastName}`);
}
say(obj);
```

# 详解 interface
## 为什么需要 Interface 
为了能具体限制一个对象的类型组成。你直接一个 `let obj:object` 只能限制它必须是object,而不能限制它的内部元素。

## 当对象的属性和个数不确定的时候

当你觉得这个属性可能没有的时候 用 `?`
```ts
// 需求: 如果传递了middleName就输出完整名称, 如果没有传递middleName, 那么就输出firstName和lastName
interface FullName{
    firstName:string
    lastName:string
    middleName?:string
    [propName:string]:any
}

function say({firstName, lastName, middleName}:FullName):void {
    // console.log(`我的姓名是:${firstName}_${lastName}`);
    if(middleName){
        console.log(`我的姓名是:${firstName}_${middleName}_${lastName}`);
    }else{
        console.log(`我的姓名是:${firstName}_${lastName}`);
    }
}

say({firstName:'Jonathan', lastName:'Lee', middleName:"666"});
say({firstName:'Jonathan', lastName:'Lee'});
```
当你觉得可能有多个属性的时候 用`索引签名`
```ts
interface FullName {
    [propName:string]:string
}
let obj:FullName = {
    // 注意点: 只要key和value满足索引签名的限定即可, 无论有多少个都无所谓
    firstName:'Jonathan',
    lastName:'Lee',
    // middleName:false // 报错
    // 无论key是什么类型最终都会自动转换成字符串类型, 所以没有报错
    // false: '666' 
}



interface stringArray {
    [propName:number]:string
}

let arr:stringArray = {
    0:'a',
    1:'b',
    2:'c'
};

// let arr:stringArray = ['a', 'b', 'c'];
console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);

```
## interface 也是可以继承的
```ts
interface LengthInterface {

  length:number

}

interface WidthInterface {

  width:number

}

interface HeightInterface {

  height:number

}

interface RectInterface extends LengthInterface,WidthInterface,HeightInterface {
// 这些都是继承过来的
  // length:number

  // width:number

  // height:number

  color:string

}

let rect:RectInterface = {

  length:10,

  width:20,

  height:30,

  color:'red'
}
```
## 对函数使用接口

```ts
interface SumInterface {
  (a:number, b:number):number
}

// 建议使用这种写法
let sum:SumInterface= function(x,y) {
  return x + y;
}

let res = sum(10, 20);

console.log(res);

// 也可以直接这么写
function sayMyName(name: string): string{
    return name
} 

sayMyName('hit')
```
# 详解函数的参数类型定义

## 在声明函数时定义
```ts
// typescript定义函数的方法
// 命名函数

function say1(name:string):void {

  console.log(name);

}

// 匿名函数

let say2 = function (name:string):void {

  console.log(name);

}

// 箭头函数

let say3 = (name:string):void =>{

  console.log(name);

}


```

## 声明函数和实现分离
### 使用type 声明函数
```ts
type addFun = (a: number, b:number) => number

let add:addFun = function(x, y) {
    return x + y
}
let res = add(3, 4)
```
### 使用 interface 声明
```ts
interface addFun {
    (a: number, b:number):number
}

let add:addFun = function(x,y) {
    return x + y
}
let res = add(3, 4)
```
## 函数参数的定义形式 
- 可选参数  ? , 可选参数后面只能跟可选参数。
- 默认参数 = 
- 剩余参数 ...

```ts
// 需求: 要求定义一个函数可以实现2个数或者3个数的加法

function add(x:number, y:number, z?:number):number {

  return x + y + (z ? z : 0);

}

function add(x:number, y:number=10):number {

  return x + y;

}

function add(x:number, ...ags:number[]) {

  console.log(x);

  console.log(ags);

}

add(10, 20, 30, 40, 50)


```

# ts的类型断言
什么是类型断言？
- 解释型强制类型转换
- 类型断言就是告诉编译器，这个数据的数据类型，无需编译器检查

如何 进行类型断言
有两种方式：
```ts
let len = (<string>str).length;

//有兼容性问题, 在使用到了JSX的时候兼容性不是很好

```
```ts
let len = (str as string).length;
```
例如: 我们拿到了一个any类型的变量, 但是我们明确的知道这个变量中保存的是字符串类型，此时我们就可以通过类型断言将any类型转换成string类型, 使用字符串类型中相关的方法了。


```ts
let str:any = 'it666';
// 当还是any的时候是没有.length的提示的
let len = (str as string).length;
console.log(len);
```
# ts的泛型
需求: 定义一个创建数组的方法, 可以创建出指定长度的数组, 并且可以用任意指定的内容填充这个数组

```ts
let getArray = (value: any, items:number = 5):any[] => {
    return new Array(items).fill(value)
}

let arr1 = getArray('item', 3)
```
当前存在的问题。
1. 编写代码没有提示, 因为TS的静态检测不知道具体是什么类型
2. 哪怕代码写错了也不会报错, 因为TS的静态检测不知道具体是什么类型

## 使用 泛型 <T>
```ts
let getArray = <T>(value:T, items:number = 5):T[]=>{

  return new Array(items).fill(value);

};

let arr = getArray<string>('abc');

// let arr = getArray<number>(6);

// 注意点: 泛型具体的类型可以不指定

// 如果没有指定, 那么就会根据我们传递的泛型参数自动推导出来

let arr = getArray('abc');

// let arr = getArray(6);

let res = arr.map(item=>item.length);

console.log(res);
```
## 泛型的作用
用来弥补any没有语法提示和报错的缺点。

最开始不指定类型，后面根据我们传入的类型确定类型。
## 使用泛型约束
默认情况下我们可以指定泛型为任意类型，但是有些情况下我们需要指定的类型满足某些条件后才能指定

那么这个时候我们就可以使用泛型约束。
```ts
// 需求: 要求指定的泛型类型必须有Length属性才可以

interface LengthInterface{

  length:number

}

let getArray = <T extends LengthInterface>(value:T, items:number = 5):T[]=>{

  return new Array(items).fill(value);

};

let arr = getArray<string>('abc');

// let arr = getArray<number>(6);

let res = arr.map(item=>item.length);
```

# 声明文件
在企业开发中，我们经常会把声明类型的部分单独提取出来，作为一个文件，单独存储。
## 自己自定义声明文件

```ts
declare let myName:string;

declare function say(name:string, age:number):void;
// 注意点: 声明中不能出现实现

declare class Person {
    name:string;
    age:number;
    constructor(name:string, age:number);
    say():void;
}

interface Man{
    name:string
    age:number
}

```
> 一般test.ts的声明文件只需要命名成test.d.ts既可以了，ts会自动去对应名字的.d.ts文件查找类型

## 引用外部的声明文件库
- 对于常用的第三方库, 其实已经有大神帮我们编写好了对应的声明文件，所以在企业开发中, 如果我们需要使用一些第三方JS库的时候我们只需要安装别人写好的声明文件即可。
- TS声明文件的规范 @types/xxx， 例如: 想要安装jQuery的声明文件, 那么只需要npm install @types/jquery 即可。
