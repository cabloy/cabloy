import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Aspect } from 'vona-module-a-aspect';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';
import { DtoUser } from '../dto/user.ts';

export interface IControllerOptionsOnion extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsOnion>({
  path: 'onion',
  tags: ['Onion'],
  meta: { mode: ['dev', 'test'] },
})
export class ControllerOnion extends BeanBase {
  @Web.get('/')
  @Aspect.aopMethod('a-orm:transaction', { enable: true, meta: { mode: 'dev' } })
  @Aspect.guardGlobal('a-user:passport', { public: true })
  index() {
    return this.ctx.db.inTransaction;
    // return 'Hello Vona';
  }

  @Web.post('//echo')
  @Aspect.guardGlobal('a-user:passport', { public: true })
  @Aspect.middlewareGlobal('a-core:gate', { gate: { mode: 'dev' } })
  @Core.gate({ gate: { mode: 'dev' } })
  @Aspect.aopMethod('a-orm:transaction', { isolationLevel: 'SERIALIZABLE', readOnly: true })
  @Core.transaction({ isolationLevel: 'READ_COMMITTED', readOnly: false })
  @Api.body(v.optional(), z.string())
  echo(
    @Arg.query('id', v.default(0), z.number()) id: number,
    temp: string,
    @Arg.query('name', z.number().optional()) name: string,
    @Arg.body(
      v.title($locale('User')),
      z.object({ id: z.number().openapi({ title: $locale('UserId') }) }),
    )
    _user: DtoUser,
  ): string | undefined {
    return `echo: ${id}:${temp}:${name}`;
  }

  @Web.post('echo2/:userId/:userName')
  // @Aspect.middlewareGlobal('a-core:gate', { gate: { mode: 'dev' } })
  @Aspect.guardGlobal('a-user:passport', { public: true })
  // echo2(@Arg.query(v.object(DtoUser, { loose: false, strict: false })) book: Partial<DtoUser>) {
  echo2(
    @Arg.param('userId', v.title($locale('UserId')), v.example('example:1')) _userId: number,
    @Arg.param('userName', v.title($locale('UserId')), v.example('example:1')) _userName: string,
    @Arg.query(DtoUser) _user: DtoUser,
    @Arg.body(
      v.title($locale('User')),
      z.object({ id: z.number().openapi({ title: $locale('UserId') }) }),
    )
    user: DtoUser,
  ): DtoUser {
    // const ctx = this.app.currentContext;
    // this.$logger.silly(ctx === this.ctx);
    return user;
  }

  @Web.get('echo3/:userId')
  @Aspect.guardGlobal('a-user:passport', { public: true })
  echo3(
    @Arg.param('userId') _userId: number,
    @Arg.query('id', v.optional()) id: number,
    @Arg.headers('Accept', v.title($locale('UserId'))) accept: string,
  ) {
    this.$logger.silly(this.ctx.path);
    // const ctx = this.app.currentContext;
    // this.$logger.silly(ctx === this.ctx);
    return `${id}:${accept}`;
  }

  @Web.post('echo4')
  @Aspect.guardGlobal('a-user:passport', { public: true })
  @Aspect.filterGlobal('a-error:error', { enable: true, logs: { 422: true } })
  @Api.body(v.array(DtoUser))
  echo4(@Arg.body(v.optional(), v.array(), v.object(DtoUser)) users: DtoUser[]): DtoUser[] {
    return users;
  }

  @Web.get('echo5')
  @Passport.public()
  echo5(@Arg.query('ids', v.default([1]), v.array(Number, { separator: '-' })) ids: number[]) {
    // const ctx = this.app.currentContext;
    // this.$logger.silly(ctx === this.ctx);
    return ids;
  }

  @Web.get('echo6')
  @Passport.admin()
  echo6() {
    return this.bean.passport.isAuthenticated;
  }
}
