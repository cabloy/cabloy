module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module) => {

module.exports = app => {

  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // create table: aFile
        let sql = `
          CREATE TABLE aFile (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            downloadId varchar(50) DEFAULT NULL,
            atomId int(11) DEFAULT '0',
            mode int(11) DEFAULT '0',
            fileSize int(11) DEFAULT '0',
            width int(11) DEFAULT '0',
            height int(11) DEFAULT '0',
            filePath varchar(255) DEFAULT NULL,
            fileName varchar(255) DEFAULT NULL,
            realName varchar(255) DEFAULT NULL,
            fileExt varchar(50) DEFAULT NULL,
            encoding varchar(50) DEFAULT NULL,
            mime varchar(50) DEFAULT NULL,
            attachment int(11) DEFAULT '0',
            flag varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // aViewFile
        sql = `
          create view aViewFile as
            select a.*,b.userName,b.avatar from aFile a
              left join aUser b on a.userId=b.id
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // aFile: mime
        const sql = `
        ALTER TABLE aFile
          CHANGE COLUMN mime mime varchar(255) DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }

    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  File: '文件',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 697:
/***/ ((module) => {

module.exports = app => {
  class FileController extends app.Controller {

    async all() {
      const options = this.ctx.request.body.options;
      options.file = 1;
      const res = await this.ctx.performAction({
        method: 'post',
        url: '/a/base/atom/select',
        body: {
          atomClass: this.ctx.request.body.atomClass,
          options,
        },
      });
      for (const item of res.list) {
        item.i_downloadUrl = this.ctx.service.file.getDownloadUrl({
          downloadId: item.i_downloadId,
          atomId: item.atomId,
          mode: item.i_mode,
          fileExt: item.i_fileExt,
        });
      }
      this.ctx.success(res);
    }

    async list() {
      const user = this.ctx.state.user.op;
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page, false);
      // where
      options.where = options.where || {};
      // check right: atom.read or user's files
      const key = this.ctx.request.body.key;
      const atomId = key && key.atomId;
      if (atomId) {
        const res = await this.ctx.bean.atom.checkRightRead({
          atom: { id: atomId },
          user,
          checkFlow: true,
        });
        if (!res) this.ctx.throw(403);
        options.where.atomId = atomId; // add where
      } else {
        options.where.userId = user.id; // add where
      }
      //
      const items = await this.ctx.service.file.list({ options });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async update() {
      //
      const user = this.ctx.state.user.op;
      const fileId = this.ctx.request.body.fileId;
      const data = this.ctx.request.body.data;
      // file
      const file = await this.ctx.model.file.get({ id: fileId });
      // check right
      await this.ctx.service.file.fileUpdateCheck({ file, user });
      // rename
      const res = await this.ctx.service.file.update({ fileId, data });
      this.ctx.success(res);
    }

    async delete() {
      //
      const user = this.ctx.state.user.op;
      let fileId = this.ctx.request.body.fileId;
      if (!fileId) {
        fileId = this.ctx.request.body.data.fileId;
      }
      // file
      const file = await this.ctx.model.file.get({ id: fileId });
      // check right
      await this.ctx.service.file.fileUpdateCheck({ file, user });
      // delete
      const res = await this.ctx.service.file.delete({ fileId });
      this.ctx.success(res);
    }

    async upload() {
      const res = await this.service.file.upload({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async download() {
      await this.service.file.download({
        downloadId: this.ctx.params.downloadId,
        atomId: parseInt(this.ctx.query.atomId || 0),
        width: this.ctx.query.width,
        height: this.ctx.query.height,
      });
    }

  }
  return FileController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const file = __webpack_require__(697);


module.exports = app => {
  const controllers = {
    file,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {

  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 267:
/***/ ((module) => {

module.exports = app => {
  class File extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFile', options: { disableDeleted: false } });
    }
  }
  return File;
};


/***/ }),

/***/ 19:
/***/ ((module) => {

module.exports = app => {
  class FileView extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aViewFile', options: { disableDeleted: false } });
    }
  }
  return FileView;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const file = __webpack_require__(267);
const fileView = __webpack_require__(19);

module.exports = app => {
  const models = {
    file,
    fileView,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // file
    { method: 'post', path: 'file/upload', controller: 'file', meta: { auth: { user: true } } },
    { method: 'get', path: 'file/download/:downloadId', controller: 'file', action: 'download', meta: { auth: { enable: false } } },
    { method: 'post', path: 'file/list', controller: 'file' },
    { method: 'post', path: 'file/update', controller: 'file' },
    { method: 'post', path: 'file/delete', controller: 'file', middlewares: 'transaction' },
    { method: 'post', path: 'file/all', controller: 'file' },
  ];
  return routes;
};


/***/ }),

/***/ 961:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(622);
const fs = __webpack_require__(747);
const require3 = __webpack_require__(718);
const sendToWormhole = require3('stream-wormhole');
const uuid = require3('uuid');
const gm = require3('gm');
const bb = require3('bluebird');
const pump = require3('pump');
const fse = require3('fs-extra');
const extend = require3('extend');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class File extends app.Service {

    // where adjusted by controller
    async list({ options }) {
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
      const list = await this.ctx.model.fileView.select(_options);
      for (const item of list) {
        item.downloadUrl = this.getDownloadUrl(item);
      }
      return list;
    }

    async delete({ fileId }) {
      // file
      const item = await this.ctx.model.file.get({ id: fileId });
      // delete
      await this.ctx.model.file.delete({ id: fileId });
      // attachmentCount
      if (item.atomId && item.attachment) {
        await this.ctx.bean.atom.attachment({ key: { atomId: item.atomId }, atom: { attachment: -1 } });
      }
    }

    async update({ fileId, data }) {
      // file
      let item = await this.ctx.model.file.get({ id: fileId });
      // update
      item = extend(true, item, data);
      await this.ctx.model.file.update(item);
    }

    async upload({ user }) {
      const stream = await this.ctx.getFileStream();
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

    async _upload({ fileContent, meta, user }) {
      // info
      const fileInfo = path.parse(meta.filename);
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
      const downloadId = uuid.v4().replace(/-/g, '');
      const _filePath = `file/${mode === 1 ? 'image' : (mode === 2 ? 'file' : 'audio')}/${this.ctx.bean.util.today()}`;
      const _fileName = uuid.v4().replace(/-/g, '');
      const destDir = await this.ctx.bean.base.getPath(_filePath, true);
      const destFile = path.join(destDir, `${_fileName}${fileInfo.ext}`);

      // write
      if (mode === 1) {
        if (fileInfo.ext === '.svg') {
          await this._outputFileContent({ destFile, fileContent });
        } else {
          // image
          await bb.fromCallback(cb => {
            let img = gm(fileContent);
            if (fields.cropped === 'true') {
              const cropbox = JSON.parse(fields.cropbox);
              img = img.crop(parseInt(cropbox.width), parseInt(cropbox.height), parseInt(cropbox.x), parseInt(cropbox.y));
            }
            img.quality(93).write(destFile, cb);
          });
          // size
          const imgSize = await bb.fromCallback(cb => {
            gm(destFile).size(cb);
          });
          imgWidth = imgSize.width;
          imgHeight = imgSize.height;
        }
      } else if (mode === 2 || mode === 3) {
        // check right only for file
        if (mode === 2) {
          await this.checkRightWrite(atomId, user);
        }
        // file
        await this._outputFileContent({ destFile, fileContent });
      }

      // fileSize
      const stat = await fse.stat(destFile);
      const fileSize = stat.size;

      // save
      const res = await this.ctx.model.file.insert({
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
        await this.ctx.bean.atom.attachment({ key: { atomId }, atom: { attachment: 1 }, user });
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
      let url = `/api/a/file/file/download/${downloadId}${(mode === 1 || mode === 3) ? fileExt : ''}`;
      if (atomId) {
        url = `${url}?atomId=${atomId}`;
      }
      return this.ctx.bean.base.getAbsoluteUrl(url);
    }

    async _getFileByDownloadId({ downloadId, atomId }) {
      if (atomId) {
        return await this.ctx.model.file.get({ downloadId, atomId });
      }
      // try to get archive
      const file = await this.ctx.model.queryOne(`
          select a.* from aFile a
            inner join aAtom b on a.atomId=b.id
              where a.iid=? and a.deleted=0 and a.mode=2 and a.downloadId=? and b.atomStage=1
        `, [ this.ctx.instance.id, downloadId ]);
      if (file) return file;
      // no matter what atomId is: maybe ===0 or !==0
      return await this.ctx.model.file.get({ downloadId });
    }

    async download({ downloadId, atomId, width, height }) {
      // downloadId
      if (!downloadId) this.ctx.throw(404);
      const extPos = downloadId.indexOf('.');
      if (extPos > -1) downloadId = downloadId.substr(0, extPos);

      // get file
      const file = await this._getFileByDownloadId({ downloadId, atomId });
      if (!file) this.ctx.throw(404);

      // pre
      let fileName = file.fileName;
      if (file.mode === 1) {
        if (file.fileExt !== '.svg') {
          // adjust image
          fileName = await this.adjustImage(file, width, height);
        }
      } else if (file.mode === 2) {
        // check right
        await this.fileDownloadCheck({ file });
      } else if (file.mode === 3) {
        // do nothing
      }

      // forward url
      const forwardUrl = this.ctx.bean.base.getForwardUrl(
        `${file.filePath}/${fileName}${file.fileExt}`
      );

      // send
      if (app.meta.isTest || app.meta.isLocal) {
        // redirect
        this.ctx.redirect(forwardUrl);
      } else {
        // redirect nginx
        // this.ctx.set('content-type', file.mime);
        this.ctx.set('content-transfer-encoding', file.encoding);
        this.ctx.set('content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.realName)}${file.fileExt}`);
        this.ctx.set('X-Accel-Redirect', forwardUrl);
        // this.ctx.success();
        this.ctx.response.status = 200;
        this.ctx.response.type = file.mime;
      }

    }

    // inner invoke
    async fileInfo({ downloadId }) {
      // downloadId
      if (!downloadId) this.ctx.throw(404);
      const extPos = downloadId.indexOf('.');
      if (extPos > -1) downloadId = downloadId.substr(0, extPos);

      // get file
      const file = await this.ctx.model.file.get({ downloadId });
      if (!file) this.ctx.throw(404);

      // absolutePath
      const destDir = await this.ctx.bean.base.getPath(file.filePath, true);
      const absolutePath = path.join(destDir, `${file.fileName}${file.fileExt}`);
      // ok
      return {
        file,
        absolutePath,
      };
    }

    async adjustImage(file, widthRequire, heightRequire) {
      widthRequire = widthRequire ? parseInt(widthRequire) : 0;
      heightRequire = heightRequire ? parseInt(heightRequire) : 0;
      if (!widthRequire && !heightRequire) return file.fileName;

      // cannot use * in path on windows
      const fileName = `${file.fileName}-${widthRequire}_${heightRequire}`;
      const destFile = await this.ctx.bean.base.getPath(
        `${file.filePath}/${fileName}${file.fileExt}`, false
      );

      const bExists = await fse.pathExists(destFile);
      if (bExists) return fileName;

      const width = widthRequire || parseInt(file.width * heightRequire / file.height);
      const height = heightRequire || parseInt(file.height * widthRequire / file.width);

      const srcFile = await this.ctx.bean.base.getPath(
        `${file.filePath}/${file.fileName}${file.fileExt}`, false
      );
      await bb.fromCallback(cb => {
        gm(srcFile)
          .resize(width, height, '!')
          .quality(100)
          .write(destFile, cb);
      });

      return fileName;
    }

    async checkRightWrite(atomId, user) {
      // not check if !atomId
      if (!atomId) return;
      const res = await this.ctx.bean.atom.checkRightAction({
        atom: { id: atomId },
        action: 3,
        stage: 'draft',
        user,
        checkFlow: true,
      });
      if (res && res.atomClosed === 0) return;
      this.ctx.throw(403);
    }

    async fileUpdateCheck({ file, user }) {
      if (!user) {
        // check user
        await this.ctx.bean.user.check();
        user = this.ctx.state.user.op;
      }
      // check
      const result = await this._fileUpdateCheck({ file, user });
      if (result) return;
      this.ctx.throw(403);
    }

    async _fileUpdateCheck({ file, user }) {
      // invoke event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'fileUpdateCheck',
        data: { file, user },
        next: async (context, next) => {
          if (context.result !== undefined) return await next();
          // not check if !atomId
          if (file.atomId) {
            const res = await this.ctx.bean.atom.checkRightAction({
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
        await this.ctx.bean.user.check();
        user = this.ctx.state.user.op;
      }
      // check
      const result = await this._fileDownloadCheck({ file, user });
      if (result) return;
      this.ctx.throw(403);
    }

    async _fileDownloadCheck({ file, user }) {
      // invoke event
      return await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'fileDownloadCheck',
        data: { file, user },
        next: async (context, next) => {
          if (context.result !== undefined) return await next();
          // not check if !atomId
          if (file.atomId) {
            const res = await this.ctx.bean.atom.checkRightRead({
              atom: { id: file.atomId },
              user,
              checkFlow: true,
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

  }

  return File;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const file = __webpack_require__(961);

module.exports = app => {
  const services = {
    file,
  };
  return services;
};


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map