const Fun = function (array) {
    let max = []
    for (let j = 0; j < array.length; j++) {
        for (let i = 0; i < array.length; i++) {
            item = array[i + 1] - array[j]
            max.push(item)
        }
    }
    max.map((item,index,array)=>{
        var maxValue = undefined;
        if(item>array[index]){ 
            maxValue = item
        }else{
            maxValue = array[index]
        }
        console.log(maxValue)
    })
    
}
Fun([1,2,3,4,5])