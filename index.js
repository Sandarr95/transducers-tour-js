const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

//* Current state
result = array.map(inc).filter(isOdd)

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

//* This looks a bit cumbersome, we want map and filter to compose so we can define them seperate from the array we want to work on. We also use reduce here as it will prime us for the final solution


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

/* This is better, but
// When we run scripts we often want to dryrun them and just add all operations to an array
// But we want to run them for real at some point

// This happens more often where we have the following structure:
// (someInputContext) -> (someTransformation) -> (someOutputEffect)
// We want the "(someTransformation)" to be separated from the doing array building
// However, this is not the case above, so how could we make it work?
// We need to get out the array building

// Some smart people figured out that Map & Filter can be defined as a foldr/foldl/reduce operation, we'll use reduce since it's familiar

// We have also see that building an array can be written as a reduce operation
*/

function buildArray(result, item) {
  result.push(item)
  return result
}

// That's just a reduce operation, maybe we can use this operation just as a parameter for map
function map(fn) {
  return function(rf) { // <- buildArray for example
    return function(result, item) { // look another reduce operation
      rf(result, fn(item))
    }
  }
}

function filter(pred) {
  return function(rf) { // <- buildArray for example, but also the function on line 78
    return function(result, item) {
      if(pred(item))
        return rf(result)
      else
        return result
    }
  }
}



console.log(result)
