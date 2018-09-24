const _formatDateTime = function(date, fmt) { // original author: meizz
  const o = {
    'M+': date.getMonth() + 1, // month
    'D+': date.getDate(), // day
    'H+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'Q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // millisecond
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  return fmt;
};

module.exports = {
  now() {
    return this.formatDateTime(null);
  },
  today() {
    return this.formatDate(null);
  },
  formatDateTime(date, fmt) {
    date = date || new Date();
    if (typeof (date) !== 'object') date = new Date(date);
    fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
    return _formatDateTime(date, fmt);
  },
  formatDate(date, sep) {
    sep = sep || '-';
    return this.formatDateTime(date, `YYYY${sep}MM${sep}DD`);
  },
  formatTime(date, sep) {
    sep = sep || ':';
    return this.formatDateTime(date, `HH${sep}mm${sep}ss`);
  },
};
