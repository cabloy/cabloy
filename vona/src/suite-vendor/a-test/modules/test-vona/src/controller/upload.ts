import type { IUploadField, IUploadFile } from 'vona-module-a-upload';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import assert from 'node:assert';
import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, v } from 'vona-module-a-openapiutils';
import { SymbolUploadValue } from 'vona-module-a-upload';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

export interface IControllerOptionsUpload extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsUpload>({ path: 'upload', meta: { mode: ['test', 'dev'] } })
export class ControllerUpload extends BeanBase {
  @Web.post('fields')
  @Passport.public()
  @Core.fileUpload()
  @Api.contentType('application/json')
  fields(
    @Arg.fields() fields: IUploadField[],
    @Arg.fields('checkes', v.array(z.string())) checkes: string[],
    @Arg.field('name', v.default('zhennann'), v.title('your name')) name: string,
  ) {
    assert.equal(fields.find(item => item.name === 'name')?.value, 'zhennann');
    assert.equal(checkes.length > 0, true);
    assert.equal(name, 'zhennann');
    return this.ctx[SymbolUploadValue];
  }

  @Web.post('file')
  @Passport.public()
  @Core.fileUpload()
  @Api.contentType('application/json')
  file(
    @Arg.field('name', v.default('zhennann')) name: string,
    @Arg.file('welcome') file: IUploadFile,
  ) {
    assert.equal(name, 'zhennann');
    assert.equal(file.name, 'welcome');
    return this.ctx[SymbolUploadValue];
  }

  @Web.post('files')
  @Passport.public()
  @Core.fileUpload()
  @Api.contentType('application/json')
  files(
    @Arg.files(v.title('more files')) files: IUploadFile[],
    @Arg.files('images', v.title('images')) images: IUploadFile[],
    @Arg.file('welcome1', v.title('single file')) file1: IUploadFile,
    @Arg.file('welcome2') file2: IUploadFile,
  ) {
    assert.equal(files.find(item => item.name === 'welcome1')?.name, 'welcome1');
    assert.equal(images.find(item => item.name === 'images')?.name, 'images');
    assert.equal(file1.name, 'welcome1');
    assert.equal(file2.name, 'welcome2');
    return this.ctx[SymbolUploadValue];
  }
}
