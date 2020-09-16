var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    // 此时的this 是 container 这个DOM对象
    console.log(this)
    // 此时的e 是 MouseEvent 这个DOM对象
    console.log(e)
    container.innerHTML = count++;
    return container.innerHTML
};

// 第一版,节流使用时间戳, 每隔一段时间，只执行一次事件。
function throttle(func, wait) {
    var context, args;
    var previous = 0
    return function (){
        var now = +new Date()
        context = this
        arg = arguments
        if (now - previous > wait) {
            func.apply(func, args)
            previous = now
        }
    }
}

// 第二版,使用定时器
function throttle1(func, wait) {
    var context, args, timeout;
    return function (){
        context = this
        args = arguments
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(func, args)
            }, wait);
        }
    }
}

// container.onmousemove = getUserAction
// container.onmousemove = throttle(getUserAction,3000)
container.onmousemove = throttle1(getUserAction,3000)

