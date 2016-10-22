(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var ONE_DAY_MS = (24*60*60*1000);

// get the "filter" color as a css thing
function mcFilterCss(d){
  var f = mcFilter(d);
  return 'rgb(' + Math.round(f.r) + ',' + Math.round(f.g) + ',' + Math.round(f.b) + ')';
}

var MCFILTERS=[
  0xCBCBCB,
  0xD8BF1A,
  0x6DB217,
  0xE17E9A,
  0x178816,
  0x9A61C8,
  0x02CDC7,
  0x0C76C0,
  0xB444C0,
  0xE5A708,
  0x875B1E,
  0xE3412A
].map(hexToRgb);

var MCGRADIENTS = [
  [0xe9e9e9,0xB1B1B1],
  [0xd8d72c,0xd1b516],
  [0xa1b720,0x5da119],
  [0xdc9ead,0xe84a7b],
  [0x18991a,0x117012],
  [0xc180da,0x6c56a6],
  [0x04dccf,0x01ab90],
  [0x08afde,0x00054e],
  [0xcf5de6,0x91369c],
  [0xDDBF00,0xE49807],
  [0x98732d,0x784a18],
  [0xe5432c,0xd43d2a]
].map(function(e){return e.map(hexToRgb)});

// get a pair of colors for a date
function mcGradient(d){
  var month = d.getMonth();
  var c1, c2, c3, c4, ratio;
  var m = monthliness(d);
  if (m >= 0.5){//end of month
    c1 = MCGRADIENTS[month][0];
    c2 = MCGRADIENTS[(month + 1) % 12][0];
    c3 = MCGRADIENTS[month][1];
    c4 = MCGRADIENTS[(month + 1) % 12][1];
    ratio = m - 0.5;
  }else{//beginning of month
    c1 = MCGRADIENTS[(month + 11) % 12][0];
    c2 = MCGRADIENTS[month][0];
    c3 = MCGRADIENTS[(month + 11) % 12][1];
    c4 = MCGRADIENTS[month][1];
    ratio = m + 0.5;
  }
  var r = monthlinessTween(ratio);
  return [rgbGradient(c1,c2,r),rgbGradient(c3,c4,r)];
}

function mcFilter(d){
  var month = d.getMonth();
  var m = monthliness(d);

  var c1, c2, ratio;
  if (m >= 0.5){//end of month
    c1 = MCFILTERS[month];
    c2 = MCFILTERS[(month + 1) % 12];
    ratio = m - 0.5;
  }else{//beginning of month
    c1 = MCFILTERS[(month + 11) % 12];
    c2 = MCFILTERS[month];
    ratio = m + 0.5;
  }
  return rgbGradient(c1,c2,monthlinessTween(ratio));
}

function mcDaylight(d){
  //get approx daylight amnt
  var todayTimeMs = d.getHours()* 60 * 60 * 1000
    + d.getMinutes() *  60 * 1000
    + d.getSeconds() *  1000
    + d.getMilliseconds();
  return daylightFunction(todayTimeMs / ONE_DAY_MS);
}

//helpers
function daysInMonth(date){
  var dt= new Date(date.getFullYear(), date.getMonth()+1, 0);
  return dt.getDate();
}
// 0 means beginning, 1 means end, .5 is middle
function monthliness(date){
  var todayTimeMs = date.getHours()* 60 * 60 * 1000
  + date.getMinutes() *  60 * 1000
  + date.getSeconds() *  1000
  + date.getMilliseconds();
  return date.getDate()/daysInMonth(date)  + (todayTimeMs/ONE_DAY_MS)/daysInMonth(date);
}
//convert js hex notation to RGB objects
function hexToRgb(hex){
  return {
    r:(hex & 0xff0000) >> 16,
    g:(hex & 0x00ff00) >> 8,
    b:hex & 0x0000ff
  };
}
//convert rgb notation to hex
function rgbToHex(rgb){
  return Math.round(rgb.b) + (Math.round(rgb.g) << 8) + (Math.round(rgb.r) << 16);
}

// gradient between two colors
function rgbGradient(c1,c2,amnt){
  return {
    r:c1.r*(1-amnt)+c2.r*(amnt),
    g:c1.g*(1-amnt)+c2.g*(amnt),
    b:c1.b*(1-amnt)+c2.b*(amnt)
  };
}

// where t is 0 to 1 => 0 to 1
function daylightFunction(t){
  var t = Math.min(Math.max(t,0),1);
  return  Math.pow(-1*Math.cos(t*2*Math.PI)/2 + .5 ,1.05);//TODO: better daylight function
}

// see https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending
// composites assuming a opaque background color (cb)
function alphaComposite(cf,cb,af){

  //composite of src, dest, alpha of src
  function comp(s,d,as){
    return s*as+d*(1-as);
  }
  return {
    r:comp(cf.r,cb.r,af),
    g:comp(cf.g,cb.g,af),
    b:comp(cf.b,cb.b,af)
  };
}

function mcGradientCss(dt){
  var cols = mcGradient(dt);
  var d = cols[0];
  var l = cols[1];
  return ["radial-gradient(rgb(",
    Math.round(d.r),
    ',',
    Math.round(d.g),
    ',',
    Math.round(d.b),
    ') 0%,rgb(',
    Math.round(l.r),
    ',',
    Math.round(l.g),
    ',',
    Math.round(l.b),
    ') 100%)'].join('');
}

function monthlinessTween(n){
  return n + Math.sin(n*2*Math.PI-Math.PI)/6.5;
}

// factory for creating functions that handle 'hex' or 'rgb' format option as last parameter
// fn must return a RGB value or an array of RGB values, and take 1 parameter
function hexWrapper(fn){

  return function(date,format){
    if (typeof format == 'undefined' ||  (typeof format == 'string' && format.toLowerCase() == 'rgb') ){
      // gool ol' RGB
      return fn(date);
    }else if (typeof format == 'string' && format.toLowerCase() == 'hex'){
      // user wants hex
      var result = fn(date);
      if (Array.isArray(result)){
        // fn returned an Array of RGB values, so convert each element
        return result.map(rgbToHex);
      }else{
        return rgbToHex(result);
      }
    }else{
      throw new TypeError('Format must be either "hex" or "rgb" or undefined');
    }
  }

}

exports.gradient = hexWrapper(mcGradient);
exports.filter = hexWrapper(mcFilter);

exports.daylight = mcDaylight;
exports.gradientCss = mcGradientCss;

if (typeof window !== "undefined"){
  window.monthColors = exports;
}

},{}]},{},[1]);
