import type { BusboyConfig } from 'busboy';
import type { Next } from 'vona';
import type { IDecoratorInterceptorOptions, IInterceptorExecute } from 'vona-module-a-aspect';

import Busboy from 'busboy';
import { createWriteStream } from 'node:fs';
import tmp from 'tmp';
import { BeanBase } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

import type { IUploadField, IUploadFile } from '../types/upload.ts';

import { SymbolUploadValue } from '../types/upload.ts';

export interface IInterceptorOptionsUpload extends IDecoratorInterceptorOptions {
  busboy?: BusboyConfig;
}

@Interceptor<IInterceptorOptionsUpload>()
export class InterceptorUpload extends BeanBase implements IInterceptorExecute {
  async execute(options: IInterceptorOptionsUpload, next: Next) {
    // recieve
    const [fields, files, filesCleanup] = await this._receive(options);
    this.ctx[SymbolUploadValue] = { fields, files };
    // next
    let res;
    try {
      res = await next();
    } finally {
      // delete temp files
      for (const fileCleanup of filesCleanup) {
        fileCleanup();
      }
      this.ctx[SymbolUploadValue] = undefined;
    }
    // ok
    return res;
  }

  async _receive(
    options: IInterceptorOptionsUpload,
  ): Promise<[IUploadField[], IUploadFile[], Function[]]> {
    return new Promise((resolve, reject) => {
      const fields: IUploadField[] = [];
      const files: IUploadFile[] = [];
      const filesCleanup: Function[] = [];
      const fileWrites: Promise<void>[] = [];
      let settled = false;
      const rejectOnce = (err: Error) => {
        if (settled) return;
        settled = true;
        reject(err);
      };
      // bb
      const bb = Busboy(Object.assign({}, options.busboy, { headers: this.ctx.req.headers }));
      bb.on('file', (name, file, info) => {
        // temp
        const fileTempObj = tmp.fileSync({
          prefix: '.temp-upload-',
        });
        const fileTemp = fileTempObj.name;
        filesCleanup.push(fileTempObj.removeCallback);
        files.push({
          name,
          file: fileTemp,
          info,
        });
        // save
        const writeStream = createWriteStream(fileTemp);
        const fileWrite = new Promise<void>((resolveWrite, rejectWrite) => {
          writeStream.on('finish', () => {
            resolveWrite();
          });
          writeStream.on('error', err => {
            rejectWrite(err);
          });
          file.on('error', err => {
            rejectWrite(err);
          });
        });
        fileWrites.push(
          fileWrite.catch(err => {
            rejectOnce(err as Error);
            throw err;
          }),
        );
        file.pipe(writeStream);
      });
      bb.on('field', (name, value, info) => {
        fields.push({
          name,
          value,
          info,
        });
      });
      bb.on('close', async () => {
        try {
          await Promise.all(fileWrites);
          if (settled) return;
          settled = true;
          resolve([fields, files, filesCleanup]);
        } catch {
          // handled by rejectOnce
        }
      });
      bb.on('error', (err: Error) => {
        rejectOnce(err);
      });
      bb.on('partsLimit', () => {
        rejectOnce(new Error('partsLimit'));
      });
      bb.on('filesLimit', () => {
        rejectOnce(new Error('filesLimit'));
      });
      bb.on('fieldsLimit', () => {
        rejectOnce(new Error('fieldsLimit'));
      });
      this.ctx.req.pipe(bb);
    });
  }
}
