const path = require('path');

module.exports = context => {
  const svg_pattern1 = /\/([^\/]+)\/front\/src\/assets\/icons\/groups\/([^\/]+)\.svg/;
  const svg_pattern2 = /icon\/([^\/]+)_([^\/]+)\.svg/;
  return {
    hasHash(file) {
      file = file.replace(/\\/g, '/');
      const name = path.basename(file);
      const parts = name.split('.');
      const partHash = parts[parts.length - 2];
      return partHash && partHash.length === 32;
    },
    combineHashFileName(file, dirname) {
      return this.hasHash(file)
        ? context.utils.assetsPath(`${dirname}/[name].[ext]`)
        : context.utils.assetsPath(`${dirname}/[name].[contenthash].[ext]`);
    },
    combineSvgFileName(file) {
      file = file.replace(/\\/g, '/');
      let match = file.match(svg_pattern1);
      if (!match) {
        match = file.match(svg_pattern2);
      }
      if (match) {
        return `icon/${match[1]}_${match[2]}.svg`;
      }
      // default is img
      return this.combineHashFileName(file, 'img');
    },
  };
};
