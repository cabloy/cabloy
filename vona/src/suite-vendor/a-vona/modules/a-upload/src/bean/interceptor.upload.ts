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
        file.pipe(createWriteStream(fileTemp));
      });
      bb.on('field', (name, value, info) => {
        fields.push({
          name,
          value,
          info,
        });
      });
      bb.on('close', () => {
        resolve([fields, files, filesCleanup]);
      });
      bb.on('error', (err: Error) => {
        reject(err);
      });
      bb.on('partsLimit', () => {
        reject(new Error('partsLimit'));
      });
      bb.on('filesLimit', () => {
        reject(new Error('filesLimit'));
      });
      bb.on('fieldsLimit', () => {
        reject(new Error('fieldsLimit'));
      });
      this.ctx.req.pipe(bb);
    });
  }
}
