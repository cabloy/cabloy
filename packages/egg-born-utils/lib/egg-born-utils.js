const os = require('os');
const path = require('path');
const fse = require('fs-extra');

// openAuthConfig
const openAuthConfig = {
  _fileName: null,
  async load() {
    // fileName
    const fileName = path.join(os.homedir(), '.cabloy', 'openauth.json');
    // config
    let config;
    const exists = await fse.pathExists(fileName);
    if (!exists) {
      config = {};
    } else {
      const content = await fse.readFile(fileName);
      config = JSON.parse(content);
    }
    // ok
    this._fileName = fileName;
    return { fileName, config };
  },
  async save({ fileName, config }) {
    await fse.outputFile(fileName || this._fileName, JSON.stringify(config, null, 2));
  },
};
// tools
const tools = {
  preferredLocale({ locale, locales }) {
    if (!locale) {
      locale = Intl.DateTimeFormat().resolvedOptions().locale;
    }
    locale = locale.toLowerCase().replace(/_/g, '-');
    // match exactly
    if (locales[locale]) return locale;
    // match fuzzy
    const localeShort = locale.split('-')[0];
    return Object.keys(locales).find(item => item.indexOf(localeShort) === 0);
  },
};
module.exports = {
  openAuthConfig,
  tools,
};
