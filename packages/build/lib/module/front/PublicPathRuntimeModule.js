/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

const RuntimeGlobals = require('webpack/lib/RuntimeGlobals.js');
const RuntimeModule = require('webpack/lib/RuntimeModule');

class PublicPathRuntimeModule extends RuntimeModule {
  constructor(publicPath) {
    super('publicPath', RuntimeModule.STAGE_BASIC);
    this.publicPath = publicPath;
  }

  /**
   * @return {string} runtime code
   */
  generate() {
    const { compilation, publicPath } = this;

    return `${RuntimeGlobals.publicPath} = window.__webpack_public_path__ || ${JSON.stringify(
      compilation.getPath(publicPath || '', {
        hash: compilation.hash || 'XXXX',
      })
    )};`;
  }
}

module.exports = PublicPathRuntimeModule;
