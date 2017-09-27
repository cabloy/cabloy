/*
* @Author: zhennann
* @Date:   2017-09-27 15:24:36
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 15:25:02
*/


/**
 * based on nodejs util.js
 * 
 * https://github.com/koajs/locales/blob/master/index.js
 * 
 */

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


let CIRCULAR_ERROR_MESSAGE;

function tryStringify(arg) {
  try {
    return JSON.stringify(arg);
  } catch (err) {
    // Populate the circular error message lazily
    if (!CIRCULAR_ERROR_MESSAGE) {
      try {
        const a = {}; a.a = a; JSON.stringify(a);
      } catch (err) {
        CIRCULAR_ERROR_MESSAGE = err.message;
      }
    }
    if (err.name === 'TypeError' && err.message === CIRCULAR_ERROR_MESSAGE) { return '[Circular]'; }
    throw err;
  }
}

function format(f) {
  if (arguments.length === 1) return f;

  let str = '';
  let a = 1;
  let lastPos = 0;
  for (let i = 0; i < f.length;) {
    if (f.charCodeAt(i) === 37/* '%'*/ && i + 1 < f.length) {
      if (f.charCodeAt(i + 1) !== 37/* '%'*/ && a >= arguments.length) {
        ++i;
        continue;
      }
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += Number(arguments[a++]);
          break;
        case 105: // 'i'
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += parseInt(arguments[a++]);
          break;
        case 102: // 'f'
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += parseFloat(arguments[a++]);
          break;
        case 106: // 'j'
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += tryStringify(arguments[a++]);
          break;
        case 115: // 's'
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += String(arguments[a++]);
          break;
        case 37: // '%'
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += '%';
          break;
        default: // any other character is not a correct placeholder
          if (lastPos < i) { str += f.slice(lastPos, i); }
          str += '%';
          lastPos = i = i + 1;
          continue;
      }
      lastPos = i = i + 2;
      continue;
    }
    ++i;
  }
  if (lastPos === 0) { str = f; } else if (lastPos < f.length) { str += f.slice(lastPos); }
  while (a < arguments.length) {
    const x = arguments[a++];
    if (x === null || (typeof x !== 'object' && typeof x !== 'symbol')) {
      str += ` ${x}`;
    } else {
      // str += ` ${inspect(x)}`;
    }
  }
  return str;
}

/**
 * based on koa-locales
 * 
 * https://github.com/koajs/locales/blob/master/index.js
 * 
 */

function getText(text, value) {

  if (arguments.length === 0) return '';

  if (!text) return '';

  if (arguments.length === 1) {
    return text;
  }
  if (arguments.length === 2) {
    if (isObject(value)) {
      return formatWithObject(text, value);
    }

    if (Array.isArray(value)) {
      return formatWithArray(text, value);
    }

    return format(text, value);
  }

  const args = new Array(arguments.length);
  args[0] = text;
  for (let i = 1; i < args.length; i++) {
    args[i] = arguments[i];
  }
  return format.apply(null, args);
}


function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

const ARRAY_INDEX_RE = /\{(\d+)\}/g;
function formatWithArray(text, values) {
  return text.replace(ARRAY_INDEX_RE, function(orignal, matched) {
    const index = parseInt(matched);
    if (index < values.length) {
      return values[index];
    }
    // not match index, return orignal text
    return orignal;
  });
}

const Object_INDEX_RE = /\{(.+?)\}/g;
function formatWithObject(text, values) {
  return text.replace(Object_INDEX_RE, function(orignal, matched) {
    const value = values[matched];
    if (value) {
      return value;
    }
    // not match index, return orignal text
    return orignal;
  });
}

module.exports = {
  format,
  getText,
};

