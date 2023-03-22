const VersionUpdate1Fn = require('./version/update1.js');
const VersionUpdate2Fn = require('./version/update2.js');
const VersionUpdate3Fn = require('./version/update3.js');
const VersionUpdate4Fn = require('./version/update4.js');
const VersionUpdate6Fn = require('./version/update6.js');
const VersionUpdate8Fn = require('./version/update8.js');
const VersionUpdate9Fn = require('./version/update9.js');
const VersionUpdate10Fn = require('./version/update10.js');
const VersionUpdate11Fn = require('./version/update11.js');
const VersionUpdate12Fn = require('./version/update12.js');
const VersionUpdate13Fn = require('./version/update13.js');
const VersionUpdate14Fn = require('./version/update14.js');
const VersionUpdate16Fn = require('./version/update16.js');
const VersionUpdate17Fn = require('./version/update17.js');
const VersionUpdate18Fn = require('./version/update18.js');
const VersionUpdate19Fn = require('./version/update19.js');
const VersionUpdate20Fn = require('./version/update20.js');
const VersionUpdate21Fn = require('./version/update21.js');
const VersionUpdate22Fn = require('./version/update22.js');
const VersionUpdate23Fn = require('./version/update23.js');
const VersionUpdate24Fn = require('./version/update24.js');
const VersionUpdate25Fn = require('./version/update25.js');
const VersionInit2Fn = require('./version/init2.js');
const VersionInit4Fn = require('./version/init4.js');
const VersionInit5Fn = require('./version/init5.js');
const VersionInit7Fn = require('./version/init7.js');
const VersionInit8Fn = require('./version/init8.js');
const VersionInit9Fn = require('./version/init9.js');
const VersionInit14Fn = require('./version/init14.js');
const VersionInit15Fn = require('./version/init15.js');

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 25) {
        const versionUpdate25 = new (VersionUpdate25Fn(this.ctx))();
        await versionUpdate25.run();
      }
      if (options.version === 24) {
        const versionUpdate24 = new (VersionUpdate24Fn(this.ctx))();
        await versionUpdate24.run();
      }
      if (options.version === 23) {
        const versionUpdate23 = new (VersionUpdate23Fn(this.ctx))();
        await versionUpdate23.run();
      }
      if (options.version === 22) {
        const versionUpdate22 = new (VersionUpdate22Fn(this.ctx))();
        await versionUpdate22.run();
      }
      if (options.version === 21) {
        const versionUpdate21 = new (VersionUpdate21Fn(this.ctx))();
        await versionUpdate21.run();
      }
      if (options.version === 20) {
        const versionUpdate20 = new (VersionUpdate20Fn(this.ctx))();
        await versionUpdate20.run();
      }
      if (options.version === 19) {
        const versionUpdate19 = new (VersionUpdate19Fn(this.ctx))();
        await versionUpdate19.run();
      }
      if (options.version === 18) {
        const versionUpdate18 = new (VersionUpdate18Fn(this.ctx))();
        await versionUpdate18.run();
      }
      if (options.version === 17) {
        const versionUpdate17 = new (VersionUpdate17Fn(this.ctx))();
        await versionUpdate17.run();
      }
      if (options.version === 16) {
        const versionUpdate16 = new (VersionUpdate16Fn(this.ctx))();
        await versionUpdate16.run();
      }
      if (options.version === 14) {
        const versionUpdate14 = new (VersionUpdate14Fn(this.ctx))();
        await versionUpdate14.run();
      }

      if (options.version === 13) {
        const versionUpdate13 = new (VersionUpdate13Fn(this.ctx))();
        await versionUpdate13.run();
      }

      if (options.version === 12) {
        const versionUpdate12 = new (VersionUpdate12Fn(this.ctx))();
        await versionUpdate12.run();
      }

      if (options.version === 11) {
        const versionUpdate11 = new (VersionUpdate11Fn(this.ctx))();
        await versionUpdate11.run();
      }

      if (options.version === 10) {
        const versionUpdate10 = new (VersionUpdate10Fn(this.ctx))();
        await versionUpdate10.run();
      }

      if (options.version === 9) {
        const versionUpdate9 = new (VersionUpdate9Fn(this.ctx))();
        await versionUpdate9.run();
      }

      if (options.version === 8) {
        const versionUpdate8 = new (VersionUpdate8Fn(this.ctx))();
        await versionUpdate8.run();
      }

      if (options.version === 6) {
        const versionUpdate6 = new (VersionUpdate6Fn(this.ctx))();
        await versionUpdate6.run();
      }

      if (options.version === 4) {
        const versionUpdate4 = new (VersionUpdate4Fn(this.ctx))();
        await versionUpdate4.run();
      }

      if (options.version === 3) {
        const versionUpdate3 = new (VersionUpdate3Fn(this.ctx))();
        await versionUpdate3.run();
      }

      if (options.version === 2) {
        const versionUpdate2 = new (VersionUpdate2Fn(this.ctx))();
        await versionUpdate2.run();
      }

      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }
    }

    async init(options) {
      if (options.version === 2) {
        const versionInit2 = new (VersionInit2Fn(this.ctx))();
        await versionInit2.run(options);
      }
      if (options.version === 4) {
        const versionInit4 = new (VersionInit4Fn(this.ctx))();
        await versionInit4.run(options);
      }
      if (options.version === 5) {
        const versionInit5 = new (VersionInit5Fn(this.ctx))();
        await versionInit5.run(options);
      }
      if (options.version === 7) {
        const versionInit7 = new (VersionInit7Fn(this.ctx))();
        await versionInit7.run(options);
      }
      if (options.version === 8) {
        const versionInit8 = new (VersionInit8Fn(this.ctx))();
        await versionInit8.run(options);
      }
      if (options.version === 9) {
        const versionInit9 = new (VersionInit9Fn(this.ctx))();
        await versionInit9.run(options);
      }
      if (options.version === 14) {
        const versionInit14 = new (VersionInit14Fn(this.ctx))();
        await versionInit14.run(options);
      }
      if (options.version === 15) {
        const versionInit15 = new (VersionInit15Fn(this.ctx))();
        await versionInit15.run(options);
      }
    }

    async update8Atoms(options) {
      const versionUpdate8 = new (VersionUpdate8Fn(this.ctx))();
      await versionUpdate8._updateAtomsInstance(options);
    }

    // async update12AtomClasses(options) {
    //   const versionUpdate12 = new (VersionUpdate12Fn(this.ctx))();
    //   await versionUpdate12._updateAtomClassesInstance(options);
    // }

    async update14_adjustRoles(options) {
      const versionUpdate14 = new (VersionUpdate14Fn(this.ctx))();
      await versionUpdate14._adjustRolesInstance(options);
    }

    async update14_adjustUsers(options) {
      const versionUpdate14 = new (VersionUpdate14Fn(this.ctx))();
      await versionUpdate14._adjustUsersInstance(options);
    }

    async update19_adjustCategories({ resourceType }) {
      const versionUpdate19 = new (VersionUpdate19Fn(this.ctx))();
      await versionUpdate19._adjustCategoriesInstance({ resourceType });
    }
  }

  return Version;
};
