import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Caching } from 'vona-module-a-caching';
import { $apiPath, Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

const __SWAGGER_HTML__ = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <script type="module" src="__SWAGGER_JS__"></script>
  </head>
  <body>
    <rapi-doc id="the-doc" spec-url="__SWAGGER_JSON__"></rapi-doc>
    <script>
    window.addEventListener('DOMContentLoaded', (event) => {
      const rapidocEl = document.getElementById('the-doc');
      rapidocEl.addEventListener('spec-loaded', (e) => {
        rapidocEl.setApiKey('bearerAuth', '__SWAGGER_ACCESSTOKEN__');
      });
    });
  </script>
  </body>
</html>
`;
export interface IControllerOptionsRapidoc extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRapidoc>({
  path: '//rapidoc',
  exclude: true,
  meta: { mode: ['dev', 'test'] },
})
export class ControllerRapidoc extends BeanBase {
  @Web.get()
  @Passport.public()
  @Api.contentType('text/html')
  @Caching.get({ cacheName: 'a-swagger:rapidoc' })
  async index(@Arg.query('version', v.default('V31')) version: string): Promise<string> {
    // signin
    let accessToken = '';
    if (this.app.meta.isDev || this.app.meta.isTest) {
      const jwt = await this.bean.passport.signinSystem('swagger', '-2');
      accessToken = jwt.accessToken;
    }
    // ui
    const _pathJS = this.scope.util.combineStaticPath('rapidoc-9.3.8/rapidoc-min.js');
    const _pathJSON = this.scope.util.combineApiPath($apiPath('//swagger/json'));
    return __SWAGGER_HTML__
      .replace('__SWAGGER_ACCESSTOKEN__', accessToken)
      .replace('__SWAGGER_JS__', _pathJS)
      .replace('__SWAGGER_JSON__', `${_pathJSON}?version=${version}`);
  }
}
