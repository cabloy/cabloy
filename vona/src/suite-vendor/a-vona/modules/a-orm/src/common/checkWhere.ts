// export function checkWhere(where) {
//   if (where === true || where === false) return where;
//   if (where === undefined || where === null) {
//     return true;
//   }
//   return where;
// }

// import { formatValueArray, isRaw } from './utils.ts';

// const __wherePlaceholderOr = '__or__';
// const __wherePlaceholderAnd = '__and__';
// const __wherePlaceholderExists = '__exists__';
// const __wherePlaceholderNotExists = '__notExists__';

// export function checkWhere(where) {
//   if (where === true || where === false) return where;
//   if (where === undefined || where === null) {
//     return true;
//   }
//   if (isRaw(where)) {
//     return where;
//   }
//   // loop
//   const wheres: Array<[key: string, value: any]> = [];
//   for (const key in where) {
//     const value = where[key];
//     // raw
//     if (isRaw(value)) {
//       wheres.push([key, value]);
//       continue;
//     }
//     // check key: exists
//     if (key.includes(__wherePlaceholderExists)) {
//       wheres.push(['EXISTS', value]);
//       continue;
//     }
//     // check key: not exists
//     if (key.includes(__wherePlaceholderNotExists)) {
//       wheres.push(['NOTEXISTS', value]);
//       continue;
//     }
//     // check key: or/and
//     let keyOrAnd;
//     if (key.includes(__wherePlaceholderOr)) {
//       keyOrAnd = 'OR';
//     } else if (key.includes(__wherePlaceholderAnd)) {
//       keyOrAnd = 'AND';
//     }
//     if (keyOrAnd) {
//       const _where = _formatOrAnd(value, keyOrAnd);
//       if (_where === true) {
//         // ignore
//       } else if (_where === false) {
//         // deny
//         return false;
//       } else {
//         wheres.push([keyOrAnd, _where]);
//       }
//       continue;
//     }
//     // check array
//     if (Array.isArray(value) && value.length === 0) {
//       return false;
//     }
//     // check object
//     if (value && !(value instanceof Date) && typeof value === 'object') {
//       // check array
//       if (['in', 'notIn'].includes(value.op)) {
//         const arr = formatValueArray(value);
//         if (value.op === 'in' && arr === null) return false;
//         if (value.op === 'notIn' && arr === null) continue;
//         wheres.push([key, { op: value.op, val: arr }]);
//         continue;
//       }
//     }
//     // otherwise
//     wheres.push([key, value]);
//   }
//   if (wheres.length === 0) return true;
//   return wheres;
// }

// function _formatOrAnd(ors, orAnd) {
//   // or
//   if (orAnd === 'OR') {
//     return _formatOrAnd_or(ors);
//   }
//   // and
//   return _formatOrAnd_and(ors);
// }

// function _formatOrAnd_or(ors) {
//   if (ors === undefined || ors === null) return false;
//   if (!Array.isArray(ors)) ors = [ors];
//   const wheres: Array<any> = [];
//   for (const or of ors) {
//     const _where = checkWhere(or);
//     if (_where === false) {
//       // ignore
//     } else if (_where === true) {
//       return true;
//     } else {
//       wheres.push(_where);
//     }
//   }
//   if (wheres.length === 0) return false;
//   return wheres;
// }

// function _formatOrAnd_and(ors) {
//   if (ors === undefined || ors === null) return true;
//   if (!Array.isArray(ors)) ors = [ors];
//   const wheres: Array<any> = [];
//   for (const or of ors) {
//     const _where = checkWhere(or);
//     if (_where === true) {
//       // ignore
//     } else if (_where === false) {
//       // deny
//       return false;
//     } else {
//       wheres.push(_where);
//     }
//   }
//   if (wheres.length === 0) return true;
//   return wheres;
// }
