import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Mcp } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';
import z from 'zod';

export interface IControllerOptionsAccessTokenTest extends IDecoratorControllerOptions {}

// Shipped test-mode fixture: generated-project E2E cannot depend on the excluded a-test suite.
@Controller<IControllerOptionsAccessTokenTest>({ path: 'accessTokenTest', meta: { mode: 'test' } })
export class ControllerAccessTokenTest extends BeanBase {
  @Mcp.tool({ name: 'mcp_e2e_access_token_read' })
  @Web.get('read')
  @Api.body(z.array(z.string()))
  @Passport.public()
  read(): string[] {
    return ['safe', 'array'];
  }
}
