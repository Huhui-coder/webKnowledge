
const uniq = function(array) {
    return Array.prototype.filter.call(array, function(item, idx) {
      return array.indexOf(item) == idx
    })
  };
  uniq([1,2,1,2])