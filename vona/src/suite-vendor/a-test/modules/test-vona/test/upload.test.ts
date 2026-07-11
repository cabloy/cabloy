import assert from 'node:assert';
import { Blob } from 'node:buffer';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $apiPath } from 'vona-module-a-openapiutils';

const uploadFilenameChinese = '更新地址.txt';
const uploadFilenameAccent = 'café.txt';

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
      const uploadFile = async (filename: string) => {
        const formData = new FormData();
        formData.append('name', 'zhennann');
        formData.append('welcome', new (Blob as any)(['hello world!']), filename);
        const url = app.util.getAbsoluteUrlByApiPath($apiPath('/test/vona/upload/file'));
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        return await res.json();
      };

      for (const filename of ['file-test.txt', uploadFilenameChinese, uploadFilenameAccent]) {
        const data = await uploadFile(filename);
        assert.equal(data.data.fields.find(item => item.name === 'name')?.value, 'zhennann');
        assert.equal(
          data.data.files.find(item => item.name === 'welcome')?.info.filename,
          filename,
        );
      }
    });
  });
  it('action:upload:strict', async () => {
    await app.bean.executor.mockCtx(async () => {
      const upload = async (formData: FormData) => {
        const url = app.util.getAbsoluteUrlByApiPath($apiPath('/test/vona/upload/strict'));
        return await fetch(url, {
          method: 'POST',
          body: formData,
        });
      };

      const formDataValid = new FormData();
      formDataValid.append('name', 'valid');
      formDataValid.append('welcome', new (Blob as any)(['1234567']), 'valid.txt');
      assert.equal((await upload(formDataValid)).ok, true);

      const formDataFields = new FormData();
      formDataFields.append('name', 'valid');
      formDataFields.append('extra', 'extra');
      formDataFields.append('welcome', new (Blob as any)(['1234567']), 'valid.txt');
      assert.equal((await upload(formDataFields)).status, 413);

      const formDataFiles = new FormData();
      formDataFiles.append('name', 'valid');
      formDataFiles.append('welcome', new (Blob as any)(['1234567']), 'valid.txt');
      formDataFiles.append('welcome', new (Blob as any)(['1234567']), 'extra.txt');
      assert.equal((await upload(formDataFiles)).status, 413);

      const formDataFieldSize = new FormData();
      formDataFieldSize.append('name', '12345679');
      formDataFieldSize.append('welcome', new (Blob as any)(['1234567']), 'valid.txt');
      assert.equal((await upload(formDataFieldSize)).status, 413);

      const formDataFileSize = new FormData();
      formDataFileSize.append('name', 'valid');
      formDataFileSize.append('welcome', new (Blob as any)(['12345679']), 'large.txt');
      assert.equal((await upload(formDataFileSize)).status, 413);
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
