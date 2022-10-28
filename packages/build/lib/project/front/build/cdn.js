module.exports = () => {
  return {
    prepare({ cdn }) {
      if (cdn && cdn.cos) {
        return this._prepare_cos({ options: cdn.cos });
      }
    },
    _prepare_cos({ options }) {
      const COSPlugin = require('webpack5-cos-plugin');
      options = Object.assign(
        {},
        {
          gzip: true,
          existCheck: true,
          removeMode: false,
        },
        options
      );
      const plugin = new COSPlugin(options);
      const assetsPublicPath =
        options.assetsPublicPath ||
        `https://${options.bucket.Bucket}.cos.${options.bucket.Region}.myqcloud.com/${options.cosBaseDir}/${options.project}/`;
      return { plugin, assetsPublicPath };
    },
  };
};
