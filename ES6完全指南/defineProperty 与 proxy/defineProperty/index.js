// function Archinc() {
//     this.value = null
//     this.array = []

//     Object.defineProperty(this, 'num', {
//         get() {
//             console.log('执行了get的操作')
//             return value
//         },
//         set(value) {
//             console.log('执行了set的操作')
//             this.value = value
//             this.array.push({ val: value })
//         }
//     })
//     this.getArchinc = function () { return this.array }
// }

// var arc = new Archinc()
// arc.num = 1
// arc.num = 12
// arc.num = 13
// console.log(arc)
// console.log(arc.getArchinc())
// 不使用Object.defineProperty 来实现点击之后+1
// window.onload = (() => {
// window.document.getElementById('button').addEventListener('click', () => {
//     var container = document.getElementById('container')
//     container.innerHTML = Number(container.innerHTML) + 1
// })
// })

// 使用Object.defineProperty 来实现点击之后+1
// 目前实现的是 监听单个属性改变，

// window.onload = (() => {
//     var obj = {
//         value: 1
//     };
//     var value = 1;
//     Object.defineProperty(obj, 'value', {
//         get: function () {
//             return value
//         },
//         set: function (newValue) {
//             value = newValue
//             document.getElementById('container').innerHTML = newValue;
//         }
//     })
//     document.getElementById('button').addEventListener("click", function () {
//         obj.value += 1;
//         console.log(obj.value)
//     });
// })

// 写一个watch 函数， 实现通过参数来监听对对象属性的变化，执行回调。
(
    function () {
        function watch(obj, name, func) {
            var value = obj[name]
            Object.defineProperty(obj, name, {
                get: function () {
                    return value;
                },
                set: function (newValue) {
                    value = newValue;
                    func(value)
                }
            })
            if (value) obj[name] = value
        }
        this.watch = watch
    }
)()
window.onload = (() => {
    var obj = {
        value: 1
    }
    watch(obj, "value", function (newvalue) {
        document.getElementById('container').innerHTML = newvalue;
    })
    document.getElementById('button').addEventListener("click", function () {
        obj.value += 1
    });
})
























