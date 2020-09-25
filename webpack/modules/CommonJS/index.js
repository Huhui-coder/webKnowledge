let p = require('./calculator.js');
console.log(p.name); // lee
console.log(p.age); // 29
p.name = 'lee++'
console.log(p.name); // lee++
p.setAge(); // 内部age++不影响导出的值
console.log(p.age); // 29
p.age++; // 导出的age++会自增

let b = require('./calculator.js');
console.log(b.name); // lee++
console.log(b.age); // 30
