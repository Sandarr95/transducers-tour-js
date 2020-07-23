const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

//* Current state
result = array.map(inc).filter(isOdd)

console.log(result)
