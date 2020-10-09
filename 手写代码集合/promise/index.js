// 简易版

const PENDING = 'pengding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class AjPromise {
    constructor(fn) {
        this.state = PENDING
        this.value = null
        this.reason = null
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = value => {
            setTimeout(() => {
                if (this.state === PENDING) {
                    this.state = FULFILLED
                    this.value = value
                    this.onFulfilledCallbacks.map((cb) => {
                        this.value = cb(this.value)
                    })
                }
            })
        }
        const reject = reason => {
            setTimeout(() => {
                if (this.state === PENDING) {
                    this.state = REJECTED
                    this.reason = reason
                    this.onRejectedCallbacks.map((cb) => {
                        this.reason = cb(this.reason)
                    })
                }
            })
        }
        try {
            fn(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        typeof onFulfilled === 'function' && this.onFulfilledCallbacks.push(onFulfilled);
        typeof onRejected === 'function' && this.onRejectedCallbacks.push(onRejected);
        // 返回this支持then 方法可以被同一个 promise 调用多次
        return this;
    }
}

new AjPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(2);
    }, 2000);
  })
    .then(res => {
      console.log(res);
      return res + 1;
    })
    .then(res => {
      console.log(res);
    });
  