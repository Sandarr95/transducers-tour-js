const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

module.exports = function(slide) {
switch(slide) {
case 1:

//* Current state
result = array.map(inc).filter(isOdd)

break;case 2:

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

break;case 3:

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

break;case 4:
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
  return function(rf) { // <- buildArray for example, but also the function in map on line 82
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
// buildArrayWithTransform3 is a reducing function itself, so giving it to reduce should work! Notice however that "result" is only an array because we used "buildArray". We can use any reducing function for this.

break;case 5: case 6:
//* Oh crap... It seems like the result has changed... What did we do wrong?!
// It seems the composition turned around. Let's unpack the composition to try and understand what's happening.
transform3 = rf => filter(isOdd)(map(inc)(rf));
// This is what the composition produced. Compose is still work back to front, however it builds up the "execution stack", meaning buildArray is added as the subsequent processor of map, and map is the subsequent processor of return. Afterwards filter returns its reducing function, this is the function which is gonna be called first and will call down into map.
// We want this turned around however... So lets do that
transform3 = comp(map(inc), filter(isOdd))
//transform3 = map(inc)
buildArrayWithTransform3 = transform3(buildArray)
result = array.reduce(buildArrayWithTransform3, [])


if(slide !== 6) break;
//* Cool, that works, lets see if we can build something other than an array
function outputToStream(stream, item) {
  stream.write(JSON.stringify(item) + '\n')
  return stream
}
var outputToStreamWithTransform3 = transform3(outputToStream)

const fs = require('fs')
const tmpWriteStream = fs.createWriteStream('./transducer-example-outputfile')
result = array.reduce(outputToStreamWithTransform3, tmpWriteStream)
}

slide===6? console.log("Look in: ", result.path): console.log(result)
}