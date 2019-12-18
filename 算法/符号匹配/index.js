const isVaild = function (s) {
    let stack = []; // 创建一个空数组，模拟栈
    const mapper = {  // 创建一个对象，模拟对应关系
        '{': '}',
        '[': ']',
        '(': ')'
    };
    for (i in s) {
        let value = s[i]
        if (['{', '[', '('].indexOf(value) > -1) {  // 如果是左符号就入栈
            stack.push(value)
        } else {  // 否则就出栈，与当前循环的值进行对比
            const peack = stack.pop()
            if (value !== mapper[peack]) { return false }
        }
    }
    if (stack.length > 0) {
        return false
    }
    return true
}
isVaild('{}')
