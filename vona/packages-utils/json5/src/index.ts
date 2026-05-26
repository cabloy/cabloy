import json5 from 'json5';

declare global {
  // eslint-disable-next-line
  var JSON5: typeof json5;
}
__patchJSON();

function __patchJSON() {
  // 2020-03-13T00:44:15.149Z
  // 2020-03-13T00:44:15Z
  // eslint-disable-next-line
  const __dateTest = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  function __jsonReviver(self: any, k, v, reviver: Function | undefined) {
    if (v && typeof v === 'string' && __dateTest.test(v)) {
      v = new Date(v);
    }
    if (!reviver) return v;
    return reviver.call(self, k, v);
  }

  function __jsonReplacer(self: any, k, v, replacer: Function | undefined) {
    if (replacer) {
      v = replacer.call(self, k, v);
    }
    if (typeof v === 'bigint') {
      v = String(v);
    }
    return v;
  }

  // json
  const _jsonParse = JSON.parse;
  JSON.parse = function (source, reviver) {
    return _jsonParse(source, function (this: any, k, v) {
      return __jsonReviver(this, k, v, reviver);
    });
  };

  const _jsonStringify = JSON.stringify;
  JSON.stringify = function (value, replacer, space) {
    return _jsonStringify(
      value,
      function (this: any, k, v) {
        return __jsonReplacer(this, k, v, replacer);
      },
      space,
    );
  };

  // json5
  const _json5Parse = json5.parse;
  // @ts-ignore ignore parse
  const parse = function (source, reviver) {
    return _json5Parse(source, function (this: any, k, v) {
      return __jsonReviver(this, k, v, reviver);
    });
  };

  const _json5Stringify = json5.stringify;
  // @ts-ignore ignore parse
  const stringify = function (value, replacer, space) {
    return _json5Stringify(
      value,
      function (this: any, k, v) {
        return __jsonReplacer(this, k, v, replacer);
      },
      space,
    );
  };

  globalThis.JSON5 = {
    parse,
    stringify,
  } as typeof json5;
}
