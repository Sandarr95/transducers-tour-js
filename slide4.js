const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

//* This is better, but
// When we run scripts we often want to dryrun them and just add all operations to an array
// But we want to run them for real at some point

// This happens more often where we have the following structure:
// (someInputContext) -> (someTransformation) -> (someOutputEffect)
// We want the "(someTransformation)" to be separated from the doing array building
// However, this is not the case above, so how could we make it work?
// We need to get out the array building

// Some smart people figured out that Map & Filter can be defined as a foldr/foldl/reduce operation, we'll use reduce since it's familiar

// We have also see that building an array can be written as a reduce operation
// We'll refer to functions with this interface as reducing functions or "rf"
// This rf has the signature "(result, item) => result"

function buildArray(result, item) {
  result.push(item)
  return result
}

// That's just a reducing function, maybe we can use this operation just as a parameter for map

function map(fn) {
  return function(rf) { // <- buildArray for example
    // Hmm, we don't have the information yet to run the functionality of map, lets return a function to provide an interface for this
    return function(result, item) { // look another reducing function
      return rf(result, fn(item))
    }
  }
}

// We can try the same for filter

function filter(pred) {
  return function(rf) { // <- buildArray for example, but also the function in map on line 35
    return function(result, item) {
      if(pred(item))
        return rf(result, item)
      else
        return result
    }
  }
}

var transform3 = comp(filter(isOdd), map(inc))
// buildArray is now parameterized
var buildArrayWithTransform3 = transform3(buildArray)
result = array.reduce(buildArrayWithTransform3, [])

console.log(result);
