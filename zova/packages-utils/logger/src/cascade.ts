/**
 * Refactored by zhennann
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

function isValidFormat(fmt) {
  if (typeof fmt.transform !== 'function') {
    throw new TypeError(
      [
        'No transform function found on format. Did you create a format instance?',
        'const myFormat = format(formatFn);',
        'const instance = myFormat();',
      ].join('\n'),
    );
  }

  return true;
}

export function cascade(formats) {
  if (!formats.every(isValidFormat)) {
    throw new Error('have not valid format');
  }

  return info => {
    let obj = info;
    for (let i = 0; i < formats.length; i++) {
      obj = formats[i].transform(obj, formats[i].options);
      if (!obj) {
        return false;
      }
    }

    return obj;
  };
}
