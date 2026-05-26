import type { IOpenapiObject } from 'vona-module-a-openapiutils';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Caching } from 'vona-module-a-caching';
import { $apiPath, Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

const __SWAGGER_HTML__ = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="SwaggerUI" />
  <title>SwaggerUI</title>
  <link rel="stylesheet" type="text/css" href="__SWAGGER_UI__" />
  <link rel="stylesheet" type="text/css" href="__SWAGGER_CSS__" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="__SWAGGER_JS__" charset="UTF-8" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '__SWAGGER_JSON__',
        dom_id: '#swagger-ui',
        onComplete: function() {
          window.ui.preauthorizeApiKey('bearerAuth', '__SWAGGER_ACCESSTOKEN__');
        },
      });
    };
  </script>
</body>
</html>
`;
export interface IControllerOptionsSwagger extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsSwagger>({
  path: '//swagger',
  exclude: true,
  meta: { mode: ['dev', 'test'] },
})
export class ControllerSwagger extends BeanBase {
  @Web.get()
  @Passport.public()
  @Api.contentType('text/html')
  @Caching.get({ cacheName: 'a-swagger:swagger' })
  async index(@Arg.query('version', v.default('V31')) version: string): Promise<string> {
    // signin
    let accessToken = '';
    if (this.app.meta.isDev || this.app.meta.isTest) {
      const jwt = await this.bean.passport.signinSystem('swagger', '-2');
      accessToken = jwt.accessToken;
    }
    // ui
    const _pathUI = this.scope.util.combineStaticPath('swagger-ui-5.18.2/swagger-ui.css');
    const _pathCSS = this.scope.util.combineStaticPath('swagger-ui-5.18.2/index.css');
    const _pathJS = this.scope.util.combineStaticPath('swagger-ui-5.18.2/swagger-ui-bundle.js');
    const _pathJSON = this.scope.util.combineApiPath($apiPath('//swagger/json'));
    return __SWAGGER_HTML__
      .replace('__SWAGGER_ACCESSTOKEN__', accessToken)
      .replace('__SWAGGER_UI__', _pathUI)
      .replace('__SWAGGER_CSS__', _pathCSS)
      .replace('__SWAGGER_JS__', _pathJS)
      .replace('__SWAGGER_JSON__', `${_pathJSON}?version=${version}`);
  }

  @Web.get('json')
  @Passport.public()
  @Api.contentType('text/plain')
  async json(@Arg.query('version', v.default('V31')) version: string): Promise<string> {
    const json = await this.bean.openapi.generateJson(version as unknown as keyof IOpenapiObject);
    return JSON.stringify(json, null, 2);
  }
}
