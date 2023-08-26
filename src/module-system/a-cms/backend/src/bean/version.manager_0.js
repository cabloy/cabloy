module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        await this._update_1(options);
      }
      if (options.version === 2) {
        await this._update_2(options);
      }
      if (options.version === 3) {
        await this._update_3(options);
      }
      if (options.version === 4) {
        await this._update_4(options);
      }
      if (options.version === 5) {
        await this._update_5(options);
      }
      if (options.version === 6) {
        await this._update_6(options);
      }
      if (options.version === 7) {
        await this._update_7(options);
      }
      if (options.version === 8) {
        await this._update_8(options);
      }
      if (options.version === 9) {
        await this._update_9(options);
      }
      if (options.version === 10) {
        await this._update_10(options);
      }
      if (options.version === 11) {
        await this._update_11(options);
      }
      if (options.version === 12) {
        await this._update_12(options);
      }
    }

    async init(options) {
      if (options.version === 1) {
        await this._init_1(options);
      }
      if (options.version === 12) {
        await this._init_12(options);
      }
      if (options.version === 13) {
        await this._init_13(options);
      }
    }

    async test() {
      await this._test();
    }
  }

  return Version;
};
