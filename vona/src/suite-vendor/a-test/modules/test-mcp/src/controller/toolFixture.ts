import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Mcp } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import z from 'zod';

export interface IControllerOptionsToolFixture extends IDecoratorControllerOptions {}

// Test-only observable effect; tests own the test-mcp lock and restore this state.
export const toolFixtureState = { count: 0 };

@Controller<IControllerOptionsToolFixture>({ path: '/mcp/test/actions', meta: { mode: 'test' } })
export class ControllerToolFixture extends BeanBase {
  @Mcp.tool({ name: 'mcp_test_action_status' })
  @Web.get('status', {
    description: 'Action Web description',
    summary: 'Action Web summary',
  })
  @Api.body(z.object({ count: z.number().int() }))
  @Passport.public()
  status(): { count: number } {
    return { count: toolFixtureState.count };
  }

  @Mcp.tool({ name: 'mcp_test_action_effect', discovery: { input: [['body']] } })
  @Web.post('effect/:label')
  @Api.body(
    z.object({
      count: z.number().int(),
      label: z.string(),
      priority: z.number().int().optional(),
      note: z.string().nullable().optional(),
    }),
  )
  @Passport.public()
  effect(
    @Arg.param('label', z.string().min(1)) label: string,
    @Arg.body(
      z.object({
        amount: z.number().int().min(1).max(3),
        priority: z.number().int().optional(),
        note: z.string().nullable().optional(),
      }),
    )
    body: { amount: number; priority?: number; note?: string | null },
  ): { count: number; label: string; priority?: number; note?: string | null } {
    toolFixtureState.count += body.amount;
    return {
      count: toolFixtureState.count,
      label,
      ...(body.priority === undefined ? {} : { priority: body.priority }),
      ...(body.note === undefined ? {} : { note: body.note }),
    };
  }

  @Mcp.tool({ name: 'mcp_test_action_scalar', ssrSites: ['basic-siteweb:web'] })
  @Web.get('scalar')
  @Api.exclude()
  @Api.body(z.number().int())
  @Passport.public()
  scalar(): number {
    return 7;
  }

  @Mcp.tool({ name: 'mcp_test_action_array' })
  @Web.get('array')
  @Api.body(z.array(z.string()))
  @Passport.public()
  array(): string[] {
    return ['safe', 'array'];
  }

  @Mcp.tool({ name: 'mcp_test_action_unsupported' })
  @Web.get('unsupported')
  @Api.contentType('text/plain')
  @Api.body(z.string())
  @Passport.public()
  unsupported(): string {
    return 'not a JSON Action';
  }

  @Web.get('excluded')
  @Api.contentType('text/plain')
  @Api.body(z.string())
  @Passport.public()
  excluded(): string {
    return 'excluded';
  }

  @Web.get('closed', { summary: 'Action Web summary' })
  @Api.body(z.object({ count: z.number().int() }))
  @Passport.public()
  closed(): { count: number } {
    return { count: toolFixtureState.count };
  }
}
