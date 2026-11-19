import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Mcp } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import z from 'zod';

export interface IControllerOptionsToolFixture extends IDecoratorControllerOptions {}

// Test-only observable effect; tests own the test-mcp lock and restore this state.
export const toolFixtureState = {
  count: 0,
  inputTransforms: 0,
  inputRefinements: 0,
  dateTransforms: 0,
  readonlyEffects: 0,
  semanticCalls: 0,
  outputTransforms: 0,
};

const readonlyRest = {
  'readonly': true,
  'form': { visible: false },
  'form-create': { readonly: true },
};
const readonlyField = z
  .string()
  .min(20)
  .transform(value => {
    toolFixtureState.readonlyEffects++;
    return value;
  })
  .openapi({ rest: readonlyRest });
const nestedShape = { writable: z.string(), serverOwned: readonlyField };
const noSubmittedReadonly = (value: object) => !Object.hasOwn(value, 'serverOwned');
const semanticInput = z
  .strictObject({
    value: z.string().transform(value => {
      toolFixtureState.inputTransforms++;
      return `${value}:native`;
    }),
    serverOwned: readonlyField,
    at: z
      .date()
      .transform(value => {
        toolFixtureState.dateTransforms++;
        return value;
      })
      .optional(),
    strict: z.strictObject(nestedShape).refine(noSubmittedReadonly).optional(),
    loose: z.looseObject(nestedShape).refine(noSubmittedReadonly).optional(),
    catchall: z.object(nestedShape).catchall(z.number()).refine(noSubmittedReadonly).optional(),
    failure: z.enum(['status422', 'zod']).optional(),
  })
  .refine(
    value => {
      toolFixtureState.inputRefinements++;
      return noSubmittedReadonly(value) && value.value !== 'reject:native';
    },
    { path: ['value'], message: 'private native refinement detail' },
  )
  .transform(value => ({ ...value, serverOwned: 'trusted output' }));

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

  @Mcp.tool({ name: 'mcp_test_action_semantic' })
  @Web.post('semantic')
  @Api.body(
    z
      .object({
        value: z.string(),
        serverOwned: z.string().openapi({ rest: readonlyRest }),
        at: z.date().optional(),
        strict: z.object({ writable: z.string() }).optional(),
        loose: z.looseObject({ writable: z.string() }).optional(),
        catchall: z.object({ writable: z.string() }).catchall(z.number()).optional(),
        failure: z.enum(['status422', 'zod']).optional(),
      })
      .transform(value => {
        toolFixtureState.outputTransforms++;
        return { ...value, value: `${value.value}:response` };
      }),
  )
  @Passport.public()
  async semantic(@Arg.body(semanticInput) body: z.output<typeof semanticInput>) {
    toolFixtureState.semanticCalls++;
    // The MCP dispatch policy must remain active inside the Action, not just its input pipe.
    if (z.number().safeParse('1').success) throw new Error('Query coercion was not disabled');
    if (body.failure === 'status422') {
      throw Object.assign(new Error('private business validation detail'), {
        status: 422,
        code: 422,
        errors: [{ message: 'private business validation detail', path: ['value'] }],
      });
    }
    if (body.failure === 'zod') {
      throw new z.ZodError([
        { code: 'custom', message: 'private business validation detail', path: ['value'] },
      ]);
    }
    return body;
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

  @Web.patch('update')
  @Api.exclude()
  @Api.body(z.null())
  @Passport.public()
  update(): void {
    throw new Error('Discovery-only update fixture');
  }

  @Web.patch('updatePatch')
  @Api.exclude()
  @Api.body(z.null())
  @Passport.public()
  updatePatch(): void {
    throw new Error('Discovery-only partial-update fixture');
  }

  @Web.post('publish')
  @Api.exclude()
  @Api.body(z.null())
  @Passport.public()
  publish(): void {
    throw new Error('Discovery-only command fixture');
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
