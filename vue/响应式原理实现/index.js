/**
①Observer需要将数据转化为响应式的，那它就应该是一个函数(类)，能接收参数。
②为了将数据变成响应式，那需要使用Object.defineProperty。
③数据不止一种类型，这就需要递归遍历来判断。
 *
 * @class Observer
 */
class Observer {
    constructor(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(data, keys[i], data[keys[i]])
        }
    }
}
class Dep {
    constructor() {
        // 定义一个收集对应属性依赖的容器
        this.subs = []
    }
    // 收集依赖的方法
    addSub() {
        // Dep.target是个全局变量，用于存储当前的一个watcher
        this.subs.push(Dep.target)
    }
    // set方法被触发时会通知依赖
    notify() {
        for (let i = 1; i < this.subs.length; i++) {
            this.subs[i].cb()
        }
    }
}

Dep.target = null

class Watch {
    constructor(exp, cb) {
        this.exp = exp
        this.cb = cb
        // 将Watch实例赋给全局变量Dep.target，这样get中就能拿到它了
        Dep.target = this
        data[exp]
    }
}
// 使用Object.defineProperty
function defineReactive(data, key, val) {
    observer(data)
    let dep = new Dep() // 新增：这样每个属性就能对应一个Dep实例了

    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            console.log('获取数据')
            dep.addSub() // 新增：get触发时会触发addSub来收集当前的Dep.target，即watcher
            return val
        },
        set(newVal) {
            console.log('设置数据')
            if (newVal === val) {
                return
            } else {
                val = newVal
                observer(newVal)
                dep.notify() // 新增：通知对应的依赖
            }
        }
    })
}


// 递归判断
function observer(data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        new Observer(data)
    } else {
        return
    }
}
data = {
    a: 1,
    b: 2
}

// 监听obj
observer(data)





