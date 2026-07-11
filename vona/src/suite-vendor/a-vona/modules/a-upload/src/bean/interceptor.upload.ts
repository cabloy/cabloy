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
      this._cleanupFiles(filesCleanup);
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
      const fileStreams: any[] = [];
      const writeStreams: ReturnType<typeof createWriteStream>[] = [];
      let bb: any;
      let settled = false;
      const rejectOnce = (err: Error) => {
        if (settled) return;
        settled = true;
        for (const file of fileStreams) {
          file.unpipe();
          file.resume();
        }
        for (const writeStream of writeStreams) {
          writeStream.destroy();
        }
        try {
          this.ctx.req.unpipe(bb);
          bb?.destroy();
          this.ctx.req.resume();
        } catch {
          // ignore cleanup errors and preserve the receive error
        }
        this._cleanupFiles(filesCleanup);
        reject(err);
      };
      try {
        // bb
        bb = Busboy(
          Object.assign({ defParamCharset: 'utf8' }, options.busboy, {
            headers: this.ctx.req.headers,
          }),
        );
        bb.on('file', (name, file, info) => {
          if (settled) {
            file.resume();
            return;
          }
          fileStreams.push(file);
          let fileTempObj: tmp.FileResult;
          try {
            fileTempObj = tmp.fileSync({
              prefix: '.temp-upload-',
            });
          } catch (err) {
            file.resume();
            rejectOnce(err as Error);
            return;
          }
          const fileTemp = fileTempObj.name;
          filesCleanup.push(fileTempObj.removeCallback);
          files.push({
            name,
            file: fileTemp,
            info,
          });
          // save
          const writeStream = createWriteStream(fileTemp);
          writeStreams.push(writeStream);
          const fileWrite = new Promise<void>(resolveWrite => {
            const complete = () => resolveWrite();
            writeStream.on('finish', complete);
            writeStream.on('error', err => {
              rejectOnce(err);
              complete();
            });
            file.on('error', err => {
              rejectOnce(err);
              complete();
            });
            file.on('limit', () => {
              rejectOnce(this._createLimitError());
              complete();
            });
          });
          fileWrites.push(fileWrite);
          file.pipe(writeStream);
        });
        bb.on('field', (name, value, info) => {
          if (info.nameTruncated || info.valueTruncated) {
            rejectOnce(this._createLimitError());
            return;
          }
          fields.push({
            name,
            value,
            info,
          });
        });
        bb.on('close', async () => {
          await Promise.all(fileWrites);
          if (settled) return;
          settled = true;
          resolve([fields, files, filesCleanup]);
        });
        bb.on('error', (err: Error) => {
          rejectOnce(err);
        });
        bb.on('partsLimit', () => {
          rejectOnce(this._createLimitError());
        });
        bb.on('filesLimit', () => {
          rejectOnce(this._createLimitError());
        });
        bb.on('fieldsLimit', () => {
          rejectOnce(this._createLimitError());
        });
        this.ctx.req.pipe(bb);
      } catch (err) {
        rejectOnce(err as Error);
      }
    });
  }

  private _cleanupFiles(filesCleanup: Function[]) {
    for (const fileCleanup of filesCleanup) {
      try {
        fileCleanup();
      } catch {
        // try every cleanup callback without masking the primary error
      }
    }
  }

  private _createLimitError() {
    const err: any = new Error('upload limit exceeded');
    err.status = 413;
    err.code = 413;
    return err as Error;
  }
}
