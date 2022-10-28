module.exports = () => {
  return {
    prepare({ cdn }) {
      if (cdn && cdn.cos) {
        return this._prepare_cos({ options: cdn.cos });
      }
      if (cdn && cdn.alioss) {
        return this._prepare_alioss({ options: cdn.alioss });
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
    _prepare_alioss({ options }) {
      const OSSPlugin = require('webpack-alioss-plugin');
      options = Object.assign(
        {},
        {
          gzip: true,
          existCheck: true,
          removeMode: false,
        },
        options
      );
      const plugin = new OSSPlugin(options);
      const assetsPublicPath =
        options.assetsPublicPath ||
        `https://${options.auth.bucket}.${options.auth.region}.aliyuncs.com/${options.ossBaseDir}/${options.project}/`;
      return { plugin, assetsPublicPath };
    },
  };
};
