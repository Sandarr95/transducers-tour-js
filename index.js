const comp = (f, g) => i => f(g(i))

const inc = i => i + 1
const isOdd = n => n % 2

const array = [1, 2, 3];
var result;

var slide = 1, perSlide = true;
if(perSlide) {
  require(`./slide${slide}`)
} else {
  require('./allSlides')(slide)
}
console.log()
