function _parseLastWord(str?: string): string | undefined {
  if (!str) return str;
  for (let i = str.length - 1; i >= 0; i--) {
    const ch = str.charAt(i);
    if (ch >= 'A' && ch <= 'Z') return str.substring(i);
  }
  return str;
}

function _parseFirstWord(str?: string): string | undefined {
  if (!str) return str;
  for (let i = 1; i < str.length; i++) {
    const ch = str.charAt(i);
    if (ch >= 'A' && ch <= 'Z') return str.substring(0, i);
  }
  return str;
}

export function toLowerCaseFirstChar(str: string) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

export function toUpperCaseFirstChar(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export function parseLastWord(str?: string, toLowerCase?: boolean): string | undefined {
  const word = _parseLastWord(str);
  if (!word) return word;
  return toLowerCase ? toLowerCaseFirstChar(word) : word;
}

export function parseFirstWord(str?: string, toLowerCase?: boolean): string | undefined {
  const word = _parseFirstWord(str);
  if (!word) return word;
  return toLowerCase ? toLowerCaseFirstChar(word) : word;
}

export function skipPrefix(
  str?: string,
  prefix?: string,
  toLowerCase?: boolean,
): string | undefined {
  if (!str) return str;
  let word: string;
  if (!prefix) {
    word = str;
  } else {
    const prefix2 = prefix.replace(/\./g, '');
    if (str.toLowerCase().startsWith(prefix2.toLowerCase())) {
      word = str.substring(prefix2.length);
    } else {
      word = str;
    }
  }
  return toLowerCase ? toLowerCaseFirstChar(word) : word;
}

export function skipLastWord(
  str?: string,
  lastWord?: string,
  toLowerCase?: boolean,
): string | undefined {
  if (!str) return str;
  if (!lastWord) lastWord = parseLastWord(str)!;
  let word;
  if (str.toLowerCase().endsWith(lastWord.toLowerCase())) {
    word = str.substring(0, str.length - lastWord.length);
  } else {
    word = str;
  }
  return toLowerCase ? toLowerCaseFirstChar(word) : word;
}

export function splitWords(
  str?: string,
  toLowerCase?: boolean,
  separator: string = ' ',
): string | undefined {
  if (!str) return str;
  // parts
  let parts: string[] = [];
  let pos = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const ch = str.charAt(i);
    if (ch >= 'A' && ch <= 'Z') {
      parts.unshift(str.substring(i, pos));
      pos = i;
    }
  }
  if (pos > 0) parts.unshift(str.substring(0, pos));
  // lowerCase
  if (toLowerCase) {
    parts = parts.map(item => toLowerCaseFirstChar(item));
  }
  // join
  return parts.join(separator);
}

export function combineWordsDeduplicate(str1: string, str2: string) {
  if (!str1 || !str2) return str1 + str2;
  const lastWord = parseLastWord(str1);
  if (!lastWord || !str2.startsWith(lastWord)) return str1 + str2;
  const leftWord = str1.substring(0, str1.length - lastWord.length);
  return leftWord + str2;
}

export function stringToCapitalize(str: string[] | string, separator?: string): string {
  if (typeof str === 'string') str = str.split(separator ?? ',');
  return str.map(name => toUpperCaseFirstChar(name)).join('');
}

export function replaceTemplate(
  content: string | undefined,
  scope?: object | undefined,
): string | undefined {
  if (!content) return content;
  if (!scope) return content;
  return content.toString().replace(/(\\)?\{\{ *([\w.]+) *\}\}/g, (block, skip, key) => {
    if (skip) {
      return block.substring(skip.length);
    }
    const value = getProperty(scope, key);
    return value !== undefined ? value : '';
  });
}

function getProperty(obj, name, sep?) {
  return _getProperty(obj, name, sep, false);
}

function _getProperty(obj, name, sep, forceObject) {
  if (!obj) return undefined;
  const names = name.split(sep || '.');
  // loop
  for (const name of names) {
    if (obj[name] === undefined || obj[name] === null) {
      if (forceObject) {
        obj[name] = {};
      } else {
        obj = obj[name];
        break;
      }
    }
    obj = obj[name];
  }
  return obj;
}

export function hashCode(input?: string): string {
  let hash = 0;
  let i;
  let chr;
  if (!input) return '';
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return (hash + 2147483647 + 1).toString();
}

export function camelToKebab(camelStr: string) {
  return toLowerCaseFirstChar(camelStr)
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();
}
