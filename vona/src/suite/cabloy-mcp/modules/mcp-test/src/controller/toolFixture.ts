import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, mcp } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import z from 'zod';

export interface IControllerOptionsToolFixture extends IDecoratorControllerOptions {}

// Test-only observable effect; tests own the mcp-test lock and restore this state.
export const toolFixtureState = { count: 0 };

@Controller<IControllerOptionsToolFixture>({ path: '/mcp/test/actions', meta: { mode: 'test' } })
export class ControllerToolFixture extends BeanBase {
  @mcp.tool({ name: 'mcp_test_action_status' })
  @Web.get('status')
  @Api.body(z.object({ count: z.number().int() }))
  @Passport.public()
  status(): { count: number } {
    return { count: toolFixtureState.count };
  }

  @mcp.tool({ name: 'mcp_test_action_effect' })
  @Web.post('effect/:label')
  @Api.body(z.object({ count: z.number().int(), label: z.string() }))
  @Passport.public()
  effect(
    @Arg.param('label', z.string().min(1)) label: string,
    @Arg.body(z.object({ amount: z.number().int().min(1).max(3) })) body: { amount: number },
  ): { count: number; label: string } {
    toolFixtureState.count += body.amount;
    return { count: toolFixtureState.count, label };
  }

  @mcp.tool({ name: 'mcp_test_action_scalar' })
  @Web.get('scalar')
  @Api.exclude()
  @Api.body(z.number().int())
  @Passport.public()
  scalar(): number {
    return 7;
  }

  @mcp.tool({ name: 'mcp_test_action_array' })
  @Web.get('array')
  @Api.body(z.array(z.string()))
  @Passport.public()
  array(): string[] {
    return ['safe', 'array'];
  }

  @mcp.tool({ name: 'mcp_test_action_unsupported' })
  @Web.get('unsupported')
  @Api.contentType('text/plain')
  @Api.body(z.string())
  @Passport.public()
  unsupported(): string {
    return 'not a JSON Action';
  }

  @Web.get('closed')
  @Api.body(z.object({ count: z.number().int() }))
  @Passport.public()
  closed(): { count: number } {
    return { count: toolFixtureState.count };
  }
}
