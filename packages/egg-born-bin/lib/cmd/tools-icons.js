const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const bb = require('bluebird');
const fse = require('fs-extra');
const xml2js = require('xml2js');
const Command = require('@zhennann/egg-bin').Command;

class ToolsIconsCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin tools-icons';
  }

  async run({ cwd, argv }) {
    console.log('run tools icons at %s', cwd);

    const moduleNames = argv._;
    for (const moduleName of moduleNames) {
      await this._generateIcons({ cwd, moduleName });
    }
    // done
    console.log(chalk.cyan('  tools-icons successfully!'));
  }

  async _generateIcons({ cwd, moduleName }) {
    const modulePath = await this._resolveModulePath({ cwd, moduleName });
    const iconsSrc = path.join(modulePath, 'icons/src');
    // groups
    const groups = await this._resolveGroups({ iconsSrc });
    for (const group of groups) {
      await this._generateIconsGroup({ modulePath, iconsSrc, group });
    }
  }

  async _generateIconsGroup({ modulePath, iconsSrc, group }) {
    // icons
    const files = await bb.fromCallback(cb => {
      glob(`${iconsSrc}/${group}/*.svg`, cb);
    });
    const iconNames = files.map(item => path.basename(item, '.svg'));
    // symbols
    const symbols = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const iconName = iconNames[index];
      const symbol = await this._combineSymbol({ file, iconName });
      symbols.push(symbol);
    }
    // xml
    const xml = `<svg xmlns="http://www.w3.org/2000/svg">
  ${symbols}
</svg>`;
    // write
    const pathDest = path.join(modulePath, 'front/src/assets/icons', 'groups');
    await fse.ensureDir(pathDest);
    const fileDest = path.join(pathDest, `${group}.svg`);
    await fse.writeFile(fileDest, xml);
  }

  async _combineSymbol({ file, iconName }) {
    // svg
    const xml = await fse.readFile(file);
    const svg = await this.parseXML({ xml });
    // root
    const domRoot = svg.$;
    const attrs = { id: iconName };
    if (domRoot.preserveAspectRatio) attrs.preserveAspectRatio = domRoot.preserveAspectRatio;
    if (domRoot.viewBox) attrs.viewBox = domRoot.viewBox;
    svg.$ = attrs;
    return this.buildXML({ xml: svg, rootName: 'symbol' });
  }

  async _resolveModulePath({ cwd, moduleName }) {
    const files = await bb.fromCallback(cb => {
      glob(`${cwd}/src/**/${moduleName}/`, cb);
    });
    if (files.length === 0) throw new Error('module not found: ', moduleName);
    return files[0];
  }

  async _resolveGroups({ iconsSrc }) {
    const groupPaths = await bb.fromCallback(cb => {
      glob(`${iconsSrc}/*`, cb);
    });
    return groupPaths.map(item => path.basename(item));
  }

  async parseXML({ xml, trim = true, explicitArray = false, explicitRoot = false }) {
    const parser = new xml2js.Parser({ trim, explicitArray, explicitRoot });
    return await bb.fromCallback(cb => {
      parser.parseString(xml, cb);
    });
  }

  buildXML({ xml, cdata = true, headless = true, rootName = 'xml' }) {
    return new xml2js.Builder({ cdata, headless, rootName }).buildObject(xml);
  }

  description() {
    return 'tools icons';
  }
}

module.exports = ToolsIconsCommand;
