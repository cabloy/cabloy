import type { Next, VonaContext } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import staticCache from '@cabloy/koa-static-cache';
import { isObject, isString } from '@cabloy/utils';
import range from 'koa-range';
import assert from 'node:assert';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { BeanBase, compose } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';
import { LRU } from 'ylru';

import { __ThisModule__ } from '../.metadata/this.ts';
import { SymbolStaticGetFullPathInner } from '../types/static.ts';

interface IStaticDirItem {
  prefix: string;
  dir: string;
}

export interface IMiddlewareSystemOptionsStatic extends IDecoratorMiddlewareSystemOptions {
  apiStaticPrefix: string;
  dir?: string;
  dirs: (string | IStaticDirItem)[];
  // support lazy load
  dynamic: boolean;
  preload: boolean;
  buffer?: boolean;
  maxFiles: number;
  maxAge?: number;
  alias: Record<string, string>;
  getFullPath: typeof getFullPath;
}

@MiddlewareSystem<IMiddlewareSystemOptionsStatic>({
  dependencies: 'a-security:securities',
  apiStaticPrefix: '/api/static/',
  dirs: [],
  dynamic: true,
  preload: false,
  maxFiles: 1000,
  alias: {
    '/favicon.ico': '/api/static/home/index/img/vona.png',
  },
  getFullPath,
  // maxAge: undefined,
  // buffer: false,
  // dir: '',
  // prefix: '/', // should be always '/', so as to support ssr site
})
export class MiddlewareSystemStatic extends BeanBase implements IMiddlewareSystemExecute {
  private _composer: any;

  async execute(options: IMiddlewareSystemOptionsStatic, next: Next) {
    return this._getComposer(options)(this.ctx, next);
  }

  _getComposer(options: IMiddlewareSystemOptionsStatic) {
    if (!this._composer) {
      const middlewares = this._createMiddlewares(options);
      this._composer = compose(middlewares);
    }
    return this._composer;
  }

  _createMiddlewares(options: IMiddlewareSystemOptionsStatic) {
    options = Object.assign(
      {
        maxAge: this.app.meta.isProd ? 31536000 : 0,
        buffer: !!this.app.meta.isProd,
        dir: this.app.config.server.publicDir,
        prefix: '/',
      },
      options,
    );

    const dirs = (options.dirs || []).concat(options.dir!);

    const prefixs: string[] = [];

    function rangeMiddleware(ctx, next) {
      // if match static file, and use range middleware.
      const isMatch = prefixs.some(p => ctx.path.startsWith(p));
      if (isMatch) {
        return range(ctx, next);
      }
      return next();
    }

    const middlewares = [rangeMiddleware];

    for (const dirObj of dirs) {
      assert(
        isObject(dirObj) || isString(dirObj),
        '`config.static.dir` must be `string | Array<string|object>`.',
      );

      let newOptions: any;

      if (isString(dirObj)) {
        // copy origin options to new options ensure the safety of objects
        newOptions = Object.assign({}, options, { dir: dirObj });
      } else {
        assert(
          isString(dirObj.dir),
          '`config.static.dir` should contains `[].dir` property when object style.',
        );
        newOptions = Object.assign({}, options, dirObj);
      }

      if (newOptions.dynamic && !newOptions.files) {
        newOptions.files = new LRU(newOptions.maxFiles);
      }

      if (newOptions.prefix) {
        prefixs.push(newOptions.prefix);
      }

      // ensure directory exists
      if (!existsSync(newOptions.dir)) {
        mkdirSync(newOptions.dir, { recursive: true });
      }

      middlewares.push(staticCache(newOptions));
    }

    return middlewares;
  }
}

async function getFullPath(
  ctx: VonaContext,
  dir: string,
  filename: string,
  options: IMiddlewareSystemOptionsStatic,
): Promise<string | true | undefined> {
  if (process.env.META_MODE === 'dev') {
    ctx[SymbolStaticGetFullPathInner] = () => {
      return _getFullPathInner(ctx, dir, filename, options);
    };
  }
  const scopeSelf = ctx.app.scope(__ThisModule__);
  return scopeSelf.event.resolvePath.emit(
    { dir, filename, options },
    ({ dir, filename, options }) => {
      return _getFullPathInner(ctx, dir, filename, options);
    },
  );
}

async function _getFullPathInner(
  ctx: VonaContext,
  dir: string,
  filename: string,
  options: IMiddlewareSystemOptionsStatic,
): Promise<string | undefined> {
  // trim prefix
  if (options.apiStaticPrefix !== '/') {
    const filePrefix = path.normalize(options.apiStaticPrefix.replace(/^\//, ''));
    if (filename.indexOf(filePrefix) !== 0) {
      return;
      // cannot throw error
      // throw new Error(`invalid filename: ${filename}`);
    }
    filename = filename.slice(filePrefix.length);
  }
  // check
  const parts = filename.split(path.sep);
  const wordFirst = parts.shift();
  // public
  if (wordFirst === 'public') {
    const fullPath = path.normalize(path.join(dir, parts.join(path.sep)));
    // files that can be accessd should be under options.dir
    if (fullPath.indexOf(dir) !== 0) throw new Error(`unsafe filename: ${filename}`);
    return fullPath;
  }
  // static
  const moduleRelativeName = `${wordFirst}-${parts.shift()}`;
  const module = ctx.app.meta.modules[moduleRelativeName];
  if (!module) {
    return;
    // cannot throw error
    // throw new Error(`invalid filename: ${filename}`);
  }
  const fullPath = ctx.app.util.getAssetPathPhysical(
    moduleRelativeName,
    'static',
    parts.join(path.sep),
  );
  return fullPath;
}
