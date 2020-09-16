window.onload = function () {
    // 简单的事件委托实现事件点击监听函数
    const ul = document.querySelector('#ul')
    const cb = function (e) {
        console.log(e.target.id)
    }
    ul.addEventListener('click', cb, false)
    // 生成新的li元素，来使用事件委托
    var newli = document.createElement('li');
    for (var i = 10; i < 20; i++) {
        var newli = document.createElement('li');
        newli.innerHTML = i;
        newli.id = i;
        ul.appendChild(newli);
    }
}