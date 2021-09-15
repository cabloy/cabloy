export default {
  parseValue(value, valueMode) {
    if (valueMode !== 'json') return value;
    let content;
    // value
    if (!value) {
      content = '{}';
    } else {
      if (typeof value === 'string') {
        content = window.JSON5.stringify(window.JSON5.parse(value), null, 2);
      } else {
        content = window.JSON5.stringify(value, null, 2);
      }
    }
    return content;
  },
};
