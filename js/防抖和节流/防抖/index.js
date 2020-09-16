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

// 第一版,简单实现功能
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}

// 第二版,处理this指向问题
function debounce1(func, wait) {
    var timeout;
    return function (){
        var context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(context)
        }, wait);
    }
}

// 第三版,处理event 对象
function debounce2(func, wait) {
    var timeout;
    return function () {
        var context = this
        var args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(context, args)
        }, wait);
    }
}

// 第四版, 加上立即执行处理
function debounce3(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this
        var args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait);
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
        return result
    }
}

// 第五版返回值
function debounce4(func, wait, immediate) {
    var timeout,
        result;
    return function () {
        var context = this
        var args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait);
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
        return result
    }
}
// 第六版, 取消防抖函数
function debounce5(func, wait, immediate) {
    var timeout,
        result;
    var debounced =  function () {
        var context = this
        var args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait);
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
        return result
    };
    debounced.cancle = function (){
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}


// container.onmousemove = debounce(getUserAction, 1000);
// container.onmousemove = debounce1(getUserAction, 1000);
// container.onmousemove = debounce2(getUserAction, 1000);
// container.onmousemove = debounce3(getUserAction, 1000, true);
// container.onmousemove = debounce4(getUserAction, 1000, true);
var setUseAction = debounce5(getUserAction, 10000, true);
container.onmousemove = setUseAction;
document.getElementById("button").addEventListener('click', function(){
    setUseAction.cancle();
})
// container.onmousemove = getUserAction;
