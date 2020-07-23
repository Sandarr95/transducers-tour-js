const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

//* Let's reimplemented to see the inner workings

function arrayMap(array, fn) {
  var result = []
  for(const item of array) {
    result.push( fn(item) )
  }
  return result
}

function arrayFilter(array, pred) {
  var result = []
  for(const item of array) {
    if(pred(item)) result.push(item)
  }
  return result
}

result = arrayFilter(arrayMap(array, inc), isOdd)

console.log(result)
