import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { useApp } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import type { TypeMcpScope } from '../types/index.ts';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsAccessTokenCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccessTokenCreate>()
export class DtoAccessTokenCreate {
  @Api.field(v.title($locale('Name')), z.string().trim().min(1).max(100))
  name: string;

  @Api.field(
    v.title($locale('AccessTokenScope')),
    v.description($locale('AccessTokenScopeHelp')),
    z
      .string()
      .regex(/^mcp:(?:all|read|custom:[\w-]{1,100})$/)
      .default('mcp:read'),
  )
  scope?: TypeMcpScope;

  @Api.field(
    v.title($locale('AccessTokenExpiresIn')),
    v.description($locale('AccessTokenExpiresInHelp')),
    z
      .number()
      .int()
      .positive()
      .safe()
      .default(() => useApp().config.modules['mcp-auth'].personalTokenTtl),
  )
  expiresIn?: number;
}
