// constants... change these if colors change.
const janHex = [0xe9e9e9,0xB1B1B1];
const janBytes = [0xe9,0xb1];
const janFilter = 0xCBCBCB;
const cssGradient = 'radial-gradient(rgb(233,233,233) 0%,rgb(177,177,177) 100%)';

// these tests are sketchy but #yolo

var assert = require('assert');
var mc = require('./');

// check exports
['daylight','gradient','gradientCss','filter'].forEach((f)=>{
  assert.equal(typeof mc[f], 'function');
});

// what a great year
var midJan = new Date('2000-01-15 12:00');

// mid day should yield 100% daylight
assert.equal(mc.daylight(midJan),1);

// mid jan gradient in rgb255
var janGradient = mc.gradient(midJan,'rgb');
assert.equal(janGradient[0].r,janBytes[0]);
assert.equal(janGradient[0].g,janBytes[0]);
assert.equal(janGradient[0].b,janBytes[0]);
assert.equal(janGradient[1].r,janBytes[1]);
assert.equal(janGradient[1].g,janBytes[1]);
assert.equal(janGradient[1].b,janBytes[1]);

//dupilicate of above but with implicit rgb format
var janGradient2 = mc.gradient(midJan);
assert.equal(janGradient2[0].r,janBytes[0]);
assert.equal(janGradient2[0].g,janBytes[0]);
assert.equal(janGradient2[0].b,janBytes[0]);
assert.equal(janGradient2[1].r,janBytes[1]);
assert.equal(janGradient2[1].g,janBytes[1]);
assert.equal(janGradient2[1].b,janBytes[1]);

// gradient for mid january in hex
var janHexGradient = mc.gradient(midJan,'hex')
assert.equal(janHexGradient[0],janHex[0]);
assert.equal(janHexGradient[1],janHex[1]);

// only accepts hex, nothing, or rgb a svalues
assert.throws(()=>{
  mc.gradient(midJan,16);
});

// filter test
assert.equal(mc.filter(midJan,'hex'),janFilter);

// css gradient test
assert.equal(mc.gradientCss(midJan),cssGradient);

console.log('tests pass, congrats :)');
process.exit(0);
