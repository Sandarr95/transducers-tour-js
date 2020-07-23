const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

//* Last slide looked a bit cumbersome, we want map and filter to compose so we can define them seperate from the array we want to work on. We also use reduce here as it will prime us for the final solution

function arrayMap2(fn) {
  return function(array) {
    return array.reduce((result, item) => {
      result.push( fn(item) )
      return result
    }, [])
  }
}

function arrayFilter2(pred) {
  return function(array) {
    return array.reduce((result, item) => {
      if(pred(item)) result.push(item)
      return result
    }, [])
  }
}

var transform2 = comp(arrayFilter2(isOdd), arrayMap2(inc))
result = transform2(array)

console.log(result);
