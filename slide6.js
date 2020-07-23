const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

//* Cool, that works, lets see if we can build something other than an array
var transform3 = comp(map(inc), filter(isOdd))

function outputToStream(stream, item) {
  stream.write(JSON.stringify(item) + '\n')
  return stream
}
var outputToStreamWithTransform3 = transform3(outputToStream)

const fs = require('fs')
const tmpWriteStream = fs.createWriteStream('./transducer-example-outputfile')
result = array.reduce(outputToStreamWithTransform3, tmpWriteStream)

console.log("Written to: ", result.path);

function map(fn) {
  return function(rf) {
    return function(result, item) {
      return rf(result, fn(item))
    }
  }
}

function filter(pred) {
  return function(rf) {
    return function(result, item) {
      if(pred(item))
        return rf(result, item)
      else
        return result
    }
    
  }
}
