// 消除魔法字符串
const shapeType = {
    triangle: Symbol(),
    roud: Symbol()
};

function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = .5 * options.width * options.height;
            console.log(area)
            break;
        case shapeType.roud:
            area = 3.14 * options.width * options.height;
            console.log(area)
            break;
    }
    return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
getArea(shapeType.roud, { width: 100, height: 100 });