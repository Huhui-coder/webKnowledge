var EventEmitter = {
    topics: {},
    on: function (topic, listener) {   //订阅事件
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        //将监听函数push到对应的数组位置，即topic事件对应listener方法
        this.topics[topic].push(listener);
    },
    emit: function (topic, data) {  //第一个参数是事件名，第二个参数是传入监听器回调方法内的参数
        if (!this.topics[topic] || this.topics[topic].length < 1) {
            return;
        }
        //对topic事件的每个监听函数，执行listener方法
        this.topics[topic].forEach(function (listener) {
            listener(data || {});
        });
    }
}
EventEmitter.on("event", function (a) {
    console.log(a);    
});
EventEmitter.on("event", function (a) {
    console.log(a);    
});

EventEmitter.emit("event", "Hi-text");   //发布事件后，控制台打印出Hi-text