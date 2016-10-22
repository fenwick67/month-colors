# Month-Colors

Get changing color gradients for a Date.  Zero dependencies.  Very pretty.

Based on [this codepen](http://codepen.io/fenwick/pen/dpwQvA?editors=0010) and generates the same gradients.  Inspired by Sony's XMB.


## Usage

```javascript
var monthColors = require('month-colors');
var october = new Date('2000-10-15 12:00');

monthColors.gradient(october);
// => [ { r: 221, g: 191, b: -8.47832399409706e-16 },  { r: 228, g: 152, b: 6.999999999999999 } ].  
// A pretty pair of orange colors for the fall season :)
// Note that these are not rounded.

monthColors.gradient(october,'hex')
// =>[ 14532352, 14981127 ], same as [0xddbf00,0xe49807]

monthColors.gradientCss(october);
// => 'radial-gradient(rgb(221,191,0) 0%,rgb(228,152,7) 100%)'

monthColors.filter(october,'hex')
// => 0xe5a708.  A slightly darker orange for text shadows, etc

monthColors.daylight(october)
// => 1 .  This represents full sun, since it's at noon

monthcolors.daylight(new Date('2000-10-15 20:00'))
// => 0.2332582478842018 .  Lower amount of light at night.
```

## API

### monthColors.gradient(date,[format])

Returns a pair of colors corresponding to a date.  Format is a String, and is either "hex" or "rgb" (assumed to be RGB format by default).

### monthColors.filter(date,[format])

Returns a color corresponding to a date.  This color will be similar to the gradient colors.  Format is a String, and is either "hex" or "rgb" (assumed to be RGB format by default).

### monthColors.gradientCss(date)

Returns a css radial-gradient corresponding to a date.

### monthColors.daylight(date)

Returns an approximate amount of daylight at the time, as a number between 0 and 1 inclusive.  Doesn't account for latitude or anything, it just goes up and down with the clock, maxing out at noon and bottoming out at midnight.

## Building / testing

test with `npm test`
build with `npm run-script browser-build` (browserify ^13.1.0 works)

that's literally it
