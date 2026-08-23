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
          assert.ok(operation.requestBody);
          const schema = (
            operation.requestBody as { content?: { 'application/json'?: { schema?: any } } }
          ).content?.['application/json']?.schema;
          assert.ok(schema);
          const schemaRef = (schema as { $ref?: string }).$ref;
          assert.ok(schemaRef);
          const schemaName = schemaRef.replace('#/components/schemas/', '');
          const schemaResolved = doc.components?.schemas?.[schemaName];
          assert.ok(schemaResolved);
          assert.ok(schemaResolved.properties?.consumerUrl);
          assert.ok(schemaResolved.required?.includes('consumerUrl'));
          if (expectation.action === 'issuePasswordSetLink') {
            assert.equal(schemaResolved.properties?.email?.format, 'email');
            assert.ok(schemaResolved.required?.includes('email'));
          }
        }
        if (expectation.action === 'consumeActivation') {
          const schema = (
            operation.requestBody as { content?: { 'application/json'?: { schema?: any } } }
          ).content?.['application/json']?.schema;
          const schemaRef = (schema as { $ref?: string })?.$ref;
          assert.ok(schemaRef);
          const schemaName = schemaRef.replace('#/components/schemas/', '');
          const schemaResolved = doc.components?.schemas?.[schemaName];
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), ['token']);
          assert.deepEqual(schemaResolved?.required, ['token']);
          assert.equal(schemaResolved?.properties?.token?.minLength, 32);
          assert.equal(schemaResolved?.properties?.token?.maxLength, 255);
        }
        if (expectation.action === 'changePassword') {
          const schema = (
            operation.requestBody as { content?: { 'application/json'?: { schema?: any } } }
          ).content?.['application/json']?.schema;
          const schemaRef = (schema as { $ref?: string })?.$ref;
          assert.ok(schemaRef);
          const schemaName = schemaRef.replace('#/components/schemas/', '');
          const schemaResolved = doc.components?.schemas?.[schemaName];
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
            const property = schemaResolved?.properties?.[field];
            assert.equal(property?.title?.toString(), title);
            assert.equal(property?.minLength, 6);
            assert.equal(property?.maxLength, 20);
            assert.equal(property?.rest?.form?.render, 'basic-input:formFieldInput');
            assert.deepEqual(property?.rest?.form?.options, { type: 'password' });
            assert.equal(property?.rest?.form?.required, true);
          }
        }
        if (expectation.action === 'updateProfile') {
          const schema = (
            operation.requestBody as { content?: { 'application/json'?: { schema?: any } } }
          ).content?.['application/json']?.schema;
          const schemaRef = (schema as { $ref?: string })?.$ref;
          assert.ok(schemaRef);
          const schemaName = schemaRef.replace('#/components/schemas/', '');
          const schemaResolved = doc.components?.schemas?.[schemaName];
          assert.deepEqual(Object.keys(schemaResolved?.properties ?? {}), [
            'name',
            'avatar',
            'locale',
            'tz',
          ]);
          assert.deepEqual(schemaResolved?.required, ['name']);
          for (const [field, title] of [
            ['name', 'home-user::AccountDisplayName'],
            ['avatar', 'home-user::AccountAvatar'],
            ['locale', 'home-user::AccountLocale'],
            ['tz', 'home-user::AccountTimezone'],
          ]) {
            assert.equal(schemaResolved?.properties?.[field]?.title?.toString(), title);
          }
          assert.equal(schemaResolved?.properties?.name?.minLength, 1);
          assert.equal(schemaResolved?.properties?.name?.maxLength, 100);
          assert.deepEqual(schemaResolved?.properties?.avatar?.type, ['string', 'null']);
          assert.deepEqual(schemaResolved?.properties?.locale?.type, ['string', 'null']);
          assert.deepEqual(schemaResolved?.properties?.tz?.type, ['string', 'null']);
          assert.equal(schemaResolved?.properties?.avatarImageId, undefined);
          assert.equal(schemaResolved?.properties?.avatarFileId, undefined);
        }
      }
    });
  });
});
