const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const { NodeVM } = require('vm2');

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
  async prepareToken(projectPath, tokenName) {
    if (!projectPath) projectPath = process.cwd();
    // tokenName
    tokenName = this.prepareTokenName(projectPath, tokenName);
    // init file
    const { config } = await this.load();
    return config.tokens[tokenName];
  },
  prepareTokenName(projectPath, tokenName) {
    if (tokenName) return tokenName;
    const pkg = require(path.join(projectPath, 'package.json'));
    return `clidev@${pkg.name}`;
  },
};
// tools
const tools = {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  debounce(func, wait) {
    let i = 0;
    return function (...args) {
      const ctx = this;
      if (i !== 0) clearTimeout(i);
      i = setTimeout(() => {
        func.apply(ctx, args);
      }, wait);
    };
  },
  _adjustLocales(_locales) {
    if (!Array.isArray(_locales)) return _locales;
    // prepare locales
    const locales = {};
    for (const item of _locales) {
      locales[item.value] = item.title;
    }
    return locales;
  },
  preferredLocale({ locale, locales }) {
    // adjustLocales
    locales = this._adjustLocales(locales);
    // locale
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
  evaluateExpression({ expression, scope, wrapper }) {
    if (wrapper === undefined) {
      wrapper = this._checkExpressionWrapper({ expression, scope });
    }
    if (!wrapper) {
      wrapper = 'none';
    } else if (wrapper === true) {
      wrapper = 'commonjs';
    }
    const vm = new NodeVM({
      console: 'inherit',
      sandbox: scope || {},
      require: false,
      nesting: true,
      wrapper,
    });
    const script = wrapper === 'none' ? `return (${expression})` : expression;
    return vm.run(script);
  },
  _checkExpressionWrapper({ expression, scope }) {
    try {
      const scopeKeys = Object.keys(scope);
      const js = `return (${expression})`;
      // eslint-disable-next-line
      new Function(scopeKeys.join(','), js);
      return 'none';
    } catch (err) {
      return 'commonjs';
    }
  },
};
module.exports = {
  openAuthConfig,
  tools,
};
