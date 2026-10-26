import type {
  OpenAPIObject,
  OperationObject,
  ReferenceObject,
  SchemaObject,
} from 'openapi3-ts/oas31';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('accountOpenapi.test.ts', () => {
  it('emits the dedicated Account operation family', async () => {
    await app.bean.executor.mockCtx(async () => {
      const controller = app.bean.onion.controller
        .getOnionsEnabledCached()
        .find(item => item.beanOptions.beanFullName === 'home-user.controller.account')
        ?.beanOptions.beanClass;
      if (!controller) throw new Error('home-user.controller.account not found');

      const expectations = [
        { action: 'current', method: 'get', isPublic: false },
        { action: 'updateProfile', method: 'patch', isPublic: false },
        {
          action: 'consumeActivation',
          method: 'post',
          isPublic: true,
        },
        {
          action: 'changePassword',
          method: 'post',
          isPublic: false,
        },
        {
          action: 'issuePasswordSetLink',
          method: 'post',
          isPublic: false,
        },
        {
          action: 'consumePasswordSet',
          method: 'post',
          isPublic: true,
        },
        {
          action: 'requestPasswordReset',
          method: 'post',
          isPublic: true,
        },
        {
          action: 'consumePasswordReset',
          method: 'post',
          isPublic: true,
        },
      ] as const;

      for (const expectation of expectations) {
        const doc = await app.bean.openapi.generateJsonOfControllerAction(
          controller,
          expectation.action,
          'V31',
        );
        const path = Object.values(doc.paths ?? {}).find(item => item?.[expectation.method]);
        const operation = path?.[expectation.method];
        assert.ok(operation);
        assert.equal(operation.operationId, `HomeUserAccount_${expectation.action}`);
        assert.deepEqual(operation.tags, ['HomeUserAccount']);
        assert.equal(!operation.security, expectation.isPublic);
        if (['issuePasswordSetLink', 'requestPasswordReset'].includes(expectation.action)) {
          const schemaResolved = requestSchema(doc, operation);
          assert.ok(schemaResolved.properties?.consumerUrl);
          assert.ok(schemaResolved.required?.includes('consumerUrl'));
          if (expectation.action === 'issuePasswordSetLink') {
            assert.equal(inlineSchema(schemaResolved.properties?.email).format, 'email');
            assert.ok(schemaResolved.required?.includes('email'));
          }
        }
        if (expectation.action === 'consumeActivation') {
          const schemaResolved = requestSchema(doc, operation);
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), ['token']);
          assert.deepEqual(schemaResolved?.required, ['token']);
          assert.equal(inlineSchema(schemaResolved.properties?.token).minLength, 32);
          assert.equal(inlineSchema(schemaResolved.properties?.token).maxLength, 255);
        }
        if (expectation.action === 'changePassword') {
          const schemaResolved = requestSchema(doc, operation);
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), [
            'currentPassword',
            'newPassword',
            'passwordConfirm',
          ]);
          assert.deepEqual(schemaResolved?.required, [
            'currentPassword',
            'newPassword',
            'passwordConfirm',
          ]);
          for (const [field, title] of [
            ['currentPassword', 'home-user::CurrentPassword'],
            ['newPassword', 'home-user::NewPassword'],
            ['passwordConfirm', 'home-user::PasswordConfirm'],
          ]) {
            const property = inlineSchema(schemaResolved.properties?.[field]);
            assert.equal(property?.title?.toString(), title);
            assert.equal(property?.minLength, 6);
            assert.equal(property?.maxLength, 20);
            assert.equal(property?.rest?.form?.render, 'basic-input:formFieldInput');
            const form = property.rest?.form;
            assert.ok(form && 'options' in form);
            assert.deepEqual(form.options, { type: 'password' });
            assert.equal(property?.rest?.form?.required, true);
          }
        }
        if (expectation.action === 'current' || expectation.action === 'updateProfile') {
          const response = operation.responses?.['200'];
          assert.ok(response && 'content' in response);
          const body = resolveSchema(doc, response.content?.['application/json']?.schema);
          const current = resolveSchema(doc, body.properties?.data);
          assert.deepEqual(inlineSchema(current.properties?.displayName).type, ['string', 'null']);
          assert.equal(current.required?.includes('displayName') ?? false, false);
          assert.equal(inlineSchema(current.properties?.name).type, 'string');
          assert.ok(current.required?.includes('name'));
        }
        if (expectation.action === 'updateProfile') {
          const schemaResolved = requestSchema(doc, operation);
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), [
            'displayName',
            'avatar',
            'locale',
            'tz',
          ]);
          assert.deepEqual(schemaResolved.required ?? [], []);
          assert.equal(schemaResolved.properties?.name, undefined);
          for (const [field, title] of [
            ['displayName', 'home-user::AccountDisplayName'],
            ['avatar', 'home-user::AccountAvatar'],
            ['locale', 'home-user::AccountLocale'],
            ['tz', 'home-user::AccountTimezone'],
          ]) {
            assert.equal(inlineSchema(schemaResolved.properties?.[field]).title?.toString(), title);
          }
          const displayName = inlineSchema(schemaResolved.properties?.displayName);
          assert.deepEqual(displayName.type, ['string', 'null']);
          assert.equal(displayName.maxLength, 100);
          assert.ok(!displayName.minLength);
          assert.deepEqual(inlineSchema(schemaResolved.properties?.avatar).type, [
            'string',
            'null',
          ]);
          assert.deepEqual(inlineSchema(schemaResolved.properties?.locale).type, [
            'string',
            'null',
          ]);
          assert.deepEqual(inlineSchema(schemaResolved.properties?.tz).type, ['string', 'null']);
          assert.equal(schemaResolved?.properties?.avatarImageId, undefined);
          assert.equal(schemaResolved?.properties?.avatarFileId, undefined);
        }
      }
    });
  });
});

function inlineSchema(
  schema: ReferenceObject | SchemaObject | undefined,
): ISchemaObjectExtensionField {
  assert.ok(schema);
  assert.ok(!('$ref' in schema));
  return schema;
}

function resolveSchema(
  doc: OpenAPIObject,
  schema: ReferenceObject | SchemaObject | undefined,
): ISchemaObjectExtensionField {
  assert.ok(schema);
  if ('$ref' in schema && typeof schema.$ref === 'string') {
    return resolveSchema(
      doc,
      doc.components?.schemas?.[schema.$ref.replace('#/components/schemas/', '')],
    );
  }
  return inlineSchema(schema);
}

function requestSchema(
  doc: OpenAPIObject,
  operation: OperationObject,
): ISchemaObjectExtensionField {
  const body = operation.requestBody;
  assert.ok(body);
  assert.ok(!('$ref' in body));
  const schema = body.content['application/json']?.schema;
  assert.ok(schema && '$ref' in schema);
  assert.ok(typeof schema.$ref === 'string');
  const schemaName = schema.$ref.replace('#/components/schemas/', '');
  return inlineSchema(doc.components?.schemas?.[schemaName]);
}
