// reduce 实现 统计数组中变量出现的次数

// var array = ['huhui', 'huhui', 'hit', 'hit', 'aa']

// const result = array.reduce((allNames, name) => {
//     if (name in allNames) {
//         allNames[name]++
//     } else {
//         allNames[name] = 1
//     }
//     return allNames;
// }, {})
// console.log(result)

// reduce 实现 根据对象中的相同属性进行分组
// var objArray = [{
//     name: 'hihi',
//     age: 21
// }, {
//     name: 'hihi',
//     age: 21
// }, {
//     name: 'hi22hi',
//     age: 22
// }, {
//     name: 'hi33hi',
//     age: 23
// }, {
//     name: 'hih22i',
//     age: 23
// }]

// const groupByKey = (objArray, property) => {
//     return objArray.reduce((acc, obj) => {
//         var key = obj[property]
//         if (!acc[key]) {
//             acc[key] = []
//         }
//         acc[key].push(obj);
//         return acc;
//     }, {})
// }
// const res = groupByKey(objArray, 'age')
// console.log(res)

var objArray = [{
    name: 'hihi',
    age: 21,
    num: 1
}, {
    name: 'hihi',
    age: 21,
    num: 1

}, {
    name: 'hi22hi',
    age: 22,
    num: 1

}, {
    name: 'hi33hi',
    age: 23,
    num: 1
}, {
    name: 'hih22i',
    age: 23,
    num: 1
}]

const groupByKey = (objArray, property) => {
    var array = []
    return objArray.reduce((acc, obj, idx, arr) => {
        if (array.includes(obj.name)) {
            console.log(acc[idx - 1])
            // obj.num += 1
            acc[idx - 1].num += 1
        } else {
            array.push(obj.name);
            acc.push(obj)
        }
        return acc;
    }, [])
}
const res = groupByKey(objArray, 'age')
console.log(res)



// 使用reduce 将对象数组中的某个数组集合合并到一个数组中去

// var friends = [{
//     name: 'Anna',
//     books: ['Bible', 'Harry Potter'],
//     age: 21
// }, {
//     name: 'Bob',
//     books: ['War and peace', 'Romeo and Juliet'],
//     age: 26
// }, {
//     name: 'Alice',
//     books: ['The Lord of the Rings', 'The Shining'],
//     age: 18
// }];

// var allbooks = friends.reduce(function (prev, curr) {
//     return [...prev, ...curr.books];
// }, ['Alphabet']);
// console.log(allbooks)

// 使用reduce 实现数组去重

// var array = [1, 2, 3, 1, 3, 2, 4, 6, 5, 4]

// myOrderedArray = array.reduce((acc, cur) => {
//     if(acc.indexOf(cur) === -1){
//         acc.push(cur)
//     }
//     return acc
// }, [])
// console.log(myOrderedArray)


