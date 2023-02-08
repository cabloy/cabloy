const path = require('path');
const fs = require('fs');
const require3 = require('require3');
const sendToWormhole = require3('stream-wormhole');
const Jimp = require3('jimp');
const bb = require3('bluebird');
const pump = require3('pump');
const fse = require3('fs-extra');
const base64url = require3('base64url');
const Mime = require3('mime');

const REGEXP_DATA_URL = /^data:([^;]+);[^,]*base64,(.*)/;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class File {
    get modelFile() {
      return ctx.model.module(moduleInfo.relativeName).file;
    }
    get modelFileView() {
      return ctx.model.module(moduleInfo.relativeName).fileView;
    }

    async all({ atomClass, options, user }) {
      // file
      options.file = 1;
      // select
      const items = await ctx.bean.atom.select({
        atomClass,
        options,
        user,
      });
      // downloadUrl
      for (const item of items) {
        item.i_downloadUrl = this.getDownloadUrl({
          downloadId: item.i_downloadId,
          atomId: item.atomId,
          mode: item.i_mode,
          fileExt: item.i_fileExt,
        });
      }
      // ok
      return items;
    }

    // key,user maybe null
    async list({ key, options, user }) {
      // page
      options.page = ctx.bean.util.page(options.page, false);
      // where
      options.where = options.where || {};
      // check right: atom.read or user's files
      const atomId = key && key.atomId;
      if (atomId) {
        if (user && user.id) {
          const res = await ctx.bean.atom.checkRightRead({
            atom: { id: atomId },
            user,
            checkFlow: true,
          });
          if (!res) ctx.throw(403);
        }
        options.where.atomId = atomId; // add where
      } else {
        if (user && user.id) {
          options.where.userId = user.id; // add where
        }
      }
      // _options
      const _options = {};
      // where
      _options.where = options.where || {};
      // orders
      _options.orders = options.orders;
      // page
      if (options.page.size !== 0) {
        _options.limit = options.page.size;
        _options.offset = options.page.index;
      }
      // select
      const items = await this.modelFileView.select(_options);
      for (const item of items) {
        item.downloadUrl = this.getDownloadUrl(item);
      }
      return items;
    }

    async attachments({ key, options, user }) {
      options = options || {};
      // filter drafts
      options.where = ctx.bean.util.extend(options.where, {
        mode: 2,
        attachment: 1,
      });
      if (!options.orders) {
        options.orders = [['realName', 'asc']];
      }
      // list
      return await this.list({ key, options, user });
    }

    async delete({ downloadId, fileId, user }) {
      // file
      const file = await this.getFile({ downloadId, fileId });
      if (!file) ctx.throw(404);
      // check right
      if (user && user.id) {
        await this.fileUpdateCheck({ file, user });
      }
      // delete
      await this.modelFile.delete({ id: file.id });
      // attachmentCount
      if (file.atomId && file.attachment) {
        await ctx.bean.atom.attachment({ key: { atomId: file.atomId }, atom: { attachment: -1 } });
      }
    }

    async update({ fileId, data, user }) {
      // check
      if (user && user.id) {
        // file
        const file = await this.modelFile.get({ id: fileId });
        // check right
        await this.fileUpdateCheck({ file, user });
      }
      // update
      await this.modelFile.update({
        id: fileId,
        ...data,
      });
    }

    async upload({ user }) {
      const stream = await ctx.getFileStream();
      try {
        const meta = {
          filename: stream.filename,
          encoding: stream.encoding,
          mime: stream.mime,
          fields: stream.fields,
        };
        return await this._upload({ fileContent: stream, meta, user });
      } catch (e) {
        await sendToWormhole(stream);
        throw e;
      }
    }

    async uploadDataUrl({ data, user }) {
      const dataUrl = data.dataUrl || '';
      const matches = dataUrl.match(REGEXP_DATA_URL);
      if (!matches) return null;
      // info
      const mime = matches[1];
      const contentBase64 = matches[2];
      let ext = mime.split('/')[1];
      if (ext.indexOf('svg') > -1) {
        ext = 'svg';
      }
      const filename = `${data.title || '_none_'}.${ext}`;
      const encoding = data.encoding || '7bit';
      // content
      const fileContent = base64url.toBuffer(contentBase64);
      // console.log('----fileContent: ', typeof fileContent);
      // meta
      const meta = {
        filename,
        encoding,
        mime,
        fields: {
          mode: data.mode,
          atomId: data.atomId,
          attachment: data.attachment,
          flag: data.flag,
        },
      };
      return await this._upload({ fileContent, meta, user });
    }

    async uploadByLocalFile({ pathFile, meta, user }) {
      if (!meta) meta = {};
      if (!meta.fields) meta.fields = {};
      // mode
      if (!meta.fields.mode) {
        meta.fields.mode = 2; // file
      }
      // filename
      if (!meta.filename) {
        meta.filename = path.basename(pathFile);
      }
      // encoding
      if (!meta.encoding) {
        meta.encoding = '7bit';
      }
      // mime
      if (!meta.mime) {
        meta.mime = Mime.getType(pathFile);
      }
      // content
      const fileContent = await fse.readFile(pathFile);
      // upload
      return await this._upload({
        fileContent,
        meta,
        user,
      });
    }

    async _upload({ fileContent, meta, user }) {
      // info
      const fileInfo = path.parse(meta.filename);
      if (fileInfo.name === '_none_') {
        fileInfo.name = '';
      }
      if (fileInfo.ext) fileInfo.ext = fileInfo.ext.toLowerCase();
      const encoding = meta.encoding;
      const mime = meta.mime;
      const fields = meta.fields;
      const mode = parseInt(fields.mode || 2);
      const atomId = parseInt(fields.atomId || 0);
      const attachment = parseInt(fields.attachment || 0);
      const flag = fields.flag || '';
      let imgWidth = 0;
      let imgHeight = 0;

      // jpeg->jpg
      if (fileInfo.ext === '.jpeg') fileInfo.ext = '.jpg';

      // dest
      const downloadId = ctx.bean.util.uuidv4();
      const _filePath = `file/${mode === 1 ? 'image' : mode === 2 ? 'file' : 'audio'}/${ctx.bean.util.today()}`;
      const _fileName = ctx.bean.util.uuidv4();
      const destDir = await ctx.bean.base.getPath(_filePath, true);
      const destFile = path.join(destDir, `${_fileName}${fileInfo.ext}`);

      // write
      if (mode === 1) {
        if (!this._isSupportedImageTypes(fileInfo.ext)) {
          await this._outputFileContent({ destFile, fileContent });
        } else {
          const size = await this._outputImageContent({ destFile, fileContent, fields, fileInfo });
          imgWidth = size.width;
          imgHeight = size.height;
        }
      } else if (mode === 2 || mode === 3) {
        // check right only for file
        if (mode === 2) {
          await this._checkRightWrite({ atomId, user });
        }
        // file
        await this._outputFileContent({ destFile, fileContent });
      }

      // fileSize
      const stat = await fse.stat(destFile);
      const fileSize = stat.size;

      // save
      const res = await this.modelFile.insert({
        userId: user ? user.id : 0,
        downloadId,
        atomId,
        mode,
        fileSize,
        width: imgWidth,
        height: imgHeight,
        filePath: _filePath,
        fileName: _fileName,
        realName: fileInfo.name,
        fileExt: fileInfo.ext,
        encoding,
        mime,
        attachment,
        flag,
      });
      const fileId = res.insertId;

      // attachmentCount
      if (atomId && attachment) {
        await ctx.bean.atom.attachment({ key: { atomId }, atom: { attachment: 1 }, user });
      }

      // ok
      const downloadUrl = this.getDownloadUrl({ downloadId, mode, fileExt: fileInfo.ext });
      return {
        fileId,
        realName: fileInfo.name,
        downloadId,
        downloadUrl,
      };
    }

    async download({ downloadId, atomId, width, height, user }) {
      // downloadId
      if (!downloadId) ctx.throw(404);
      const extPos = downloadId.indexOf('.');
      if (extPos > -1) downloadId = downloadId.substr(0, extPos);

      // get file
      const file = await this._getFileByDownloadId({ downloadId, atomId });
      if (!file) ctx.throw(404);

      // pre
      let fileName = file.fileName;
      if (file.mode === 1) {
        if (this._isSupportedImageTypes(file.fileExt)) {
          // adjust image
          fileName = await this._adjustImage(file, width, height);
        }
      } else if (file.mode === 2) {
        // check right
        await this.fileDownloadCheck({ file, user });
      } else if (file.mode === 3) {
        // do nothing
      }

      // forward url
      const forwardUrl = ctx.bean.base.getForwardUrl(`${file.filePath}/${fileName}${file.fileExt}`);

      // send
      if (ctx.app.meta.isTest || ctx.app.meta.isLocal) {
        // redirect
        ctx.redirect(forwardUrl);
      } else {
        // redirect nginx
        // ctx.set('content-type', file.mime);
        ctx.set('content-transfer-encoding', file.encoding);
        ctx.set(
          'content-disposition',
          `attachment; filename*=UTF-8''${encodeURIComponent(file.realName)}${file.fileExt}`
        );
        ctx.set('X-Accel-Redirect', forwardUrl);
        // ctx.success();
        ctx.response.status = 200;
        ctx.response.type = file.mime;
      }
    }

    async getFile({ downloadId, fileId }) {
      let file;
      if (downloadId) {
        const extPos = downloadId.indexOf('.');
        if (extPos > -1) downloadId = downloadId.substr(0, extPos);
        file = await this.modelFile.get({ downloadId });
      } else if (fileId) {
        file = await this.modelFile.get({ id: fileId });
      }
      return file;
    }

    // inner invoke
    async fileInfo({ downloadId, fileId }) {
      const file = await this.getFile({ downloadId, fileId });
      if (!file) ctx.throw(404);

      // absolutePath
      const destDir = await ctx.bean.base.getPath(file.filePath, true);
      const absolutePath = path.join(destDir, `${file.fileName}${file.fileExt}`);
      // ok
      return {
        file,
        absolutePath,
      };
    }

    async loadBuffer({ downloadId }) {
      const fileInfo = await this.fileInfo({ downloadId });
      const buffer = await fse.readFile(fileInfo.absolutePath);
      return {
        ...fileInfo,
        buffer,
      };
    }

    async fileUpdateCheck({ file, user }) {
      if (!user) {
        // check user
        await ctx.bean.user.check();
        user = ctx.state.user.op;
      }
      // check
      const result = await this._fileUpdateCheck({ file, user });
      if (result) return;
      ctx.throw(403);
    }

    async _fileUpdateCheck({ file, user }) {
      // invoke event
      return await ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'fileUpdateCheck',
        data: { file, user },
        next: async (context, next) => {
          if (context.result !== undefined) return await next();
          // not check if !atomId
          if (file.atomId) {
            const res = await ctx.bean.atom.checkRightAction({
              atom: { id: file.atomId },
              action: 3,
              stage: 'draft',
              user,
              checkFlow: true,
            });
            context.result = res && res.atomClosed === 0;
          } else {
            // check if self
            context.result = file.userId === user.id;
          }
          // next
          await next();
        },
      });
    }

    async fileDownloadCheck({ file, user }) {
      if (!user) {
        // check user
        await ctx.bean.user.check();
        user = ctx.state.user.op;
      }
      // check
      const result = await this._fileDownloadCheck({ file, user });
      if (result) return;
      ctx.throw(403);
    }

    async _fileDownloadCheck({ file, user }) {
      // invoke event
      return await ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'fileDownloadCheck',
        data: { file, user },
        next: async (context, next) => {
          if (context.result !== undefined) return await next();
          // not check if !atomId
          if (file.atomId) {
            const res = await ctx.bean.atom.checkRightRead({
              atom: { id: file.atomId },
              user,
              checkFlow: true,
              disableAuthOpenCheck: true,
            });
            context.result = !!res;
          } else {
            // check if self
            context.result = file.userId === user.id;
          }
          // next
          await next();
        },
      });
    }

    _isSupportedImageTypes(fileExt) {
      return (
        !['.svg', '.svgz'].includes(fileExt) && ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif'].includes(fileExt)
      );
    }

    async _adjustImage(file, widthRequire, heightRequire) {
      widthRequire = widthRequire ? parseInt(widthRequire) : 0;
      heightRequire = heightRequire ? parseInt(heightRequire) : 0;
      if (!widthRequire && !heightRequire) return file.fileName;

      // cannot use * in path on windows
      const fileName = `${file.fileName}-${widthRequire}_${heightRequire}`;
      const destFile = await ctx.bean.base.getPath(`${file.filePath}/${fileName}${file.fileExt}`, false);

      const bExists = await fse.pathExists(destFile);
      if (bExists) return fileName;

      const width = widthRequire || parseInt((file.width * heightRequire) / file.height);
      const height = heightRequire || parseInt((file.height * widthRequire) / file.width);

      const srcFile = await ctx.bean.base.getPath(`${file.filePath}/${file.fileName}${file.fileExt}`, false);

      // image
      let img = await Jimp.read(srcFile);
      img = img.resize(width, height);
      await bb.fromCallback(cb => {
        img.write(destFile, cb);
      });

      return fileName;
    }

    async _getFileByDownloadId({ downloadId, atomId }) {
      if (atomId) {
        return await this.modelFile.get({ downloadId, atomId });
      }
      // try to get formal
      const file = await ctx.model.queryOne(
        `
          select a.* from aFile a
            inner join aAtom b on a.atomId=b.id
              where a.iid=? and a.deleted=0 and a.mode=2 and a.downloadId=? and b.atomStage=1
        `,
        [ctx.instance.id, downloadId]
      );
      if (file) return file;
      // no matter what atomId is: maybe ===0 or !==0
      return await ctx.model.file.get({ downloadId });
    }

    async _checkRightWrite({ atomId, user }) {
      // not check if !atomId
      if (!atomId) return;
      const res = await ctx.bean.atom.checkRightAction({
        atom: { id: atomId },
        action: 3,
        // stage: 'draft', // support formal
        user,
        checkFlow: true,
        disableAuthOpenCheck: true,
      });
      if (res && res.atomClosed === 0) return;
      ctx.throw(403);
    }

    async _outputImageContent({ destFile, fileContent, fields, fileInfo }) {
      // prepare image content
      const tmpFile = destFile + fileInfo.ext;
      await this._outputFileContent({ destFile: tmpFile, fileContent });
      // image
      let img = await Jimp.read(tmpFile);
      // crop
      if (fields.cropped === 'true') {
        const cropbox = JSON.parse(fields.cropbox);
        img = img.crop(parseInt(cropbox.x), parseInt(cropbox.y), parseInt(cropbox.width), parseInt(cropbox.height));
      }
      // fixed
      if (fields.fixed) {
        const fixed = JSON.parse(fields.fixed);
        if (fixed.width && fixed.height) {
          img = img.resize(fixed.width, fixed.height);
        } else if (fixed.width) {
          img = img.resize(fixed.width, Jimp.AUTO);
        } else if (fixed.height) {
          img = img.resize(Jimp.AUTO, fixed.height);
        }
      }
      // quality
      if (['.png', '.jpg', '.jpeg'].includes(fileInfo.ext)) {
        img = img.quality(93);
      }
      // save
      await bb.fromCallback(cb => {
        img.write(destFile, cb);
      });
      // size
      const width = img.bitmap.width;
      const height = img.bitmap.height;
      // delete tmp file
      await fse.remove(tmpFile);
      // ready
      return { width, height };
    }

    async _outputFileContent({ destFile, fileContent }) {
      if (Buffer.isBuffer(fileContent)) {
        // buffer
        await fse.outputFile(destFile, fileContent);
      } else {
        // stream
        const writeStream = fs.createWriteStream(destFile);
        await bb.fromCallback(cb => {
          pump(fileContent, writeStream, cb);
        });
      }
    }

    getDownloadUrl({ downloadId, atomId, mode, fileExt }) {
      let url = `/api/a/file/file/download/${downloadId}${mode === 1 || mode === 3 ? fileExt : ''}`;
      if (atomId) {
        url = `${url}?atomId=${atomId}`;
      }
      return ctx.bean.base.getAbsoluteUrl(url);
    }
  }
  return File;
};
