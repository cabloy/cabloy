import cookie from 'cookie';
import Mustache from 'mustache';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import * as StackTrace from 'stack-trace';
import { BeanBase, cast } from 'vona';
import { Service } from 'vona-module-a-bean';

const startingSlashRegex = /\\|\//;

@Service()
export class ServiceErrorView extends BeanBase {
  private codeContext = 5;
  private _filterHeaders = ['cookie', 'connection'];

  toHTML(error: Error, viewTemplate: string): string {
    return this.complieView(viewTemplate, this.getErrorData(error));
  }

  getErrorData(error: Error) {
    const stack = this.parseError(error);
    const data = this.serializeData(error, stack, (frame, index) => {
      const serializedFrame = this.serializeFrame(frame) as any;
      serializedFrame.classes = this.getFrameClasses(frame, index);
      return serializedFrame;
    }) as any;

    data.request = this.serializeRequest();
    data.appInfo = this.serializeAppInfo();

    data.meta = {
      errorLogo: this.$scope.core.static.get('img/vona.svg'),
    };
    return data;
  }

  complieView(tpl, locals) {
    return Mustache.render(tpl, locals);
  }

  isNode(frame) {
    if (frame.isNative()) {
      return true;
    }
    const filename = frame.getFileName() || '';
    return !path.isAbsolute(filename) && filename[0] !== '.';
  }

  isApp(frame) {
    if (this.isNode(frame)) {
      return false;
    }
    const filename = frame.getFileName() || '';
    return !filename.includes(`node_modules${path.sep}`);
  }

  getFrameSource(contentsCache: Record<string, string>, frame) {
    const filename = frame.getFileName();
    const lineNumber = frame.getLineNumber();
    let contents = contentsCache[filename];
    if (contents === undefined) {
      contents = fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : '';
      contentsCache[filename] = contents;
    }
    const lines = contents.split(/\r?\n/);

    return {
      pre: lines.slice(Math.max(0, lineNumber - (this.codeContext + 1)), lineNumber - 1),
      line: lines[lineNumber - 1],
      post: lines.slice(lineNumber, lineNumber + this.codeContext),
    };
  }

  parseError(error: Error) {
    const stack = StackTrace.parse(error);
    const contentsCache: Record<string, string> = {};
    return stack.map(frame => {
      if (!this.isNode(frame)) {
        frame.context = this.getFrameSource(contentsCache, frame);
      }
      return frame;
    });
  }

  getContext(frame) {
    if (!frame.context) {
      return {};
    }

    return {
      start: frame.getLineNumber() - (frame.context.pre || []).length,
      pre: frame.context.pre.join('\n'),
      line: frame.context.line,
      post: frame.context.post.join('\n'),
    };
  }

  getFrameClasses(frame, index) {
    const classes: string[] = [];
    if (index === 0) {
      classes.push('active');
    }

    if (!this.isApp(frame)) {
      classes.push('native-frame');
    }

    return classes.join(' ');
  }

  serializeFrame(frame) {
    const filename = frame.getFileName();
    const relativeFileName = filename.includes(process.cwd())
      ? filename.replace(process.cwd(), '').replace(startingSlashRegex, '')
      : filename;
    const extname = path.extname(filename).replace('.', '');

    return {
      extname,
      file: relativeFileName,
      method: frame.getFunctionName(),
      line: frame.getLineNumber(),
      column: frame.getColumnNumber(),
      context: this.getContext(frame),
    };
  }

  serializeData(error: Error, stack, frameFomatter) {
    const code = error.code;
    let message = this.app.util.detectErrorMessage(error);
    if (code) {
      message = `${message} (code: ${code})`;
    }
    return {
      code,
      message,
      name: error.name,
      status: error.status,
      frames: Array.isArray(stack)
        ? stack.filter(frame => frame.getFileName()).map(frameFomatter)
        : [],
    };
  }

  serializeRequest() {
    const headers: Array<{ key: string; value: string | string[] | undefined }> = [];

    Object.keys(this.ctx.request.headers).forEach(key => {
      if (this._filterHeaders.includes(key)) {
        return;
      }
      headers.push({
        key,
        value: this.ctx.request.headers[key],
      });
    });

    const parsedCookies = cookie.parse(this.ctx.request.headers.cookie || '');
    const cookies = Object.keys(parsedCookies).map(key => {
      return { key, value: parsedCookies[key] };
    });

    return {
      url: this.ctx.request.url,
      httpVersion: cast(this.ctx.request).httpVersion,
      method: this.ctx.request.method,
      connection: this.ctx.request.headers.connection,
      headers,
      cookies,
    };
  }

  serializeAppInfo() {
    let config = this.ctx.config;
    if (typeof cast(this.app).dumpConfigToObject === 'function') {
      config = cast(this.app).dumpConfigToObject().config.config;
    }
    return {
      projectPath: this.app.options.projectPath,
      config: util.inspect(config),
    };
  }
}
