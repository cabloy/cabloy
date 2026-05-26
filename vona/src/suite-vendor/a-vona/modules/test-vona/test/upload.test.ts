import assert from 'node:assert';
import { Blob } from 'node:buffer';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $apiPath } from 'vona-module-a-openapiutils';

describe('upload.test.ts', () => {
  it('action:upload:fields', async () => {
    await app.bean.executor.mockCtx(async () => {
      const formData = new FormData();
      formData.append('name', 'zhennann');
      formData.append('checkes', 'apple');
      formData.append('checkes', 'pear');
      // formData.append('checkes', ['apple', 'pear']);
      const url = app.util.getAbsoluteUrlByApiPath($apiPath('/test/vona/upload/fields'));
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      assert.equal(data.data.fields.find(item => item.name === 'name')?.value, 'zhennann');
    });
  });
  it('action:upload:file', async () => {
    await app.bean.executor.mockCtx(async () => {
      const formData = new FormData();
      formData.append('name', 'zhennann');
      formData.append('welcome', new (Blob as any)(['hello world!']), 'file-test.txt');
      const url = app.util.getAbsoluteUrlByApiPath($apiPath('/test/vona/upload/file'));
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      assert.equal(data.data.fields.find(item => item.name === 'name')?.value, 'zhennann');
      assert.equal(
        data.data.files.find(item => item.name === 'welcome')?.info.filename,
        'file-test.txt',
      );
    });
  });
  it('action:upload:files', async () => {
    await app.bean.executor.mockCtx(async () => {
      const formData = new FormData();
      formData.append('name', 'zhennann');
      formData.append(
        'welcome1',
        new (Blob as any)(['hello world!'], { type: 'text/plain' }),
        'file-test1.txt',
      );
      formData.append(
        'welcome2',
        new (Blob as any)(['hello world!'], { type: 'text/plain' }),
        'file-test2.txt',
      );
      formData.append('images', new (Blob as any)(['hello world!'], { type: 'text/plain' }));
      formData.append('images', new (Blob as any)(['hello world!'], { type: 'text/plain' }));
      const url = app.util.getAbsoluteUrlByApiPath($apiPath('/test/vona/upload/files'));
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      assert.equal(data.data.fields.find(item => item.name === 'name')?.value, 'zhennann');
      assert.equal(
        data.data.files.find(item => item.name === 'welcome1')?.info.filename,
        'file-test1.txt',
      );
      assert.equal(
        data.data.files.find(item => item.name === 'welcome2')?.info.filename,
        'file-test2.txt',
      );
    });
  });
});
