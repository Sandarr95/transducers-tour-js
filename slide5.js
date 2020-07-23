const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;


//* Oh crap... It seems like the result has changed... What did we do wrong?!
// It seems the composition turned around. Let's unpack the composition to try and understand what's happening.
transform3 = rf => filter(isOdd)(map(inc)(rf));
// This is what the composition produced. Compose still works back to front, however it builds up the "execution stack", meaning buildArray is added as the subsequent processor of map, and map is the subsequent processor of filter. Afterwards filter returns its reducing function, this is the function which is gonna be called first and will call down into map, etc.
// If we want map to be the first transformation we have to turn it around, so let's do that
transform3 = comp(map(inc), filter(isOdd))
//transform3 = map(inc)
buildArrayWithTransform3 = transform3(buildArray)
result = array.reduce(buildArrayWithTransform3, [])

console.log(result)

function buildArray(result, item) {
  result.push(item)
  return result
}

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
