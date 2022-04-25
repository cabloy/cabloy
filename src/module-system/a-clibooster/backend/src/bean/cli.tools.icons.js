const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');
const glob = require3('glob');
const bb = require3('bluebird');
const xml2js = require3('xml2js');

module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ user }) {
      const { cwd, argv } = this.context;
      // super
      await super.execute({ user });
      const moduleNames = argv._;
      const total = moduleNames.length;
      for (let index = 0; index < total; index++) {
        const moduleName = moduleNames[index];
        // log
        await this.console.log({
          progressNo: 0,
          total,
          progress: index,
          text: moduleName,
        });
        // generate
        await this._generateIcons({ cwd, moduleName });
      }
    }

    async _generateIcons({ cwd, moduleName }) {
      const modulePath = await this._resolveModulePath({ cwd, moduleName });
      const iconsSrc = path.join(modulePath, 'icons/src');
      // groups
      const groups = await this._resolveGroups({ iconsSrc });
      for (const group of groups) {
        group.iconNames = await this._generateIconsGroup({ modulePath, iconsSrc, group });
      }
      // write to front
      const groupsFrontImport = [];
      const groupsFrontExport = [];
      for (const group of groups) {
        groupsFrontImport.push(`import _${group.name} from '../assets/icons/groups/${group.name}.svg';`);
        groupsFrontExport.push(`${group.name}: _${group.name},`);
      }
      const jsFront = `${groupsFrontImport.join('\n')}\n\nexport default {\n  ${groupsFrontExport.join('\n  ')}\n};\n`;
      const pathFront = path.join(modulePath, 'front/src/config');
      const fileFront = path.join(modulePath, 'front/src/config/icons.js');
      await fse.ensureDir(pathFront);
      await fse.writeFile(fileFront, jsFront);
      // write to backend
      const groupsBackend = [];
      for (const group of groups) {
        groupsBackend.push(`${group.name}: '${group.iconNames.join(',')}',`);
      }
      const jsBackend = `module.exports = {\n  ${groupsBackend.join('\n  ')}\n};\n`;
      const pathBackend = path.join(modulePath, 'backend/src/config/icons');
      const fileBackend = path.join(modulePath, 'backend/src/config/icons/groups.js');
      await fse.ensureDir(pathBackend);
      await fse.writeFile(fileBackend, jsBackend);
    }

    async _generateIconsGroup({ modulePath, iconsSrc, group }) {
      // icons
      const files = await bb.fromCallback(cb => {
        glob(`${iconsSrc}/${group.name}/*.svg`, cb);
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
      const xml = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
${symbols.join('\n')}
</svg>`;
      // write
      const pathDest = path.join(modulePath, 'front/src/assets/icons', 'groups');
      await fse.ensureDir(pathDest);
      const fileDest = path.join(pathDest, `${group.name}.svg`);
      await fse.writeFile(fileDest, xml);
      // ok
      return iconNames;
    }

    async _combineSymbol({ file, iconName }) {
      // svg
      const xml = await fse.readFile(file);
      const svg = await this.parseXML({ xml });
      // patch
      delete svg.defs;
      delete svg.metadata;
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
      return groupPaths.map(item => {
        return {
          name: path.basename(item),
        };
      });
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
  }

  return Cli;
};
