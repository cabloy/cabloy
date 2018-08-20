const path = require('path');
const fs = require('fs');
const require3 = require('require3');
const sendToWormhole = require3('stream-wormhole');
const uuid = require3('uuid');
const gm = require3('gm');
const bb = require3('bluebird');
const pump = require3('pump');
const fse = require3('fs-extra');

module.exports = app => {

  class File extends app.Service {

    async upload({ user }) {
      const stream = await this.ctx.getFileStream();
      try {
        // info
        const fileInfo = path.parse(stream.filename);
        const encoding = stream.encoding;
        const mime = stream.mime;
        const fields = stream.fields;
        const mode = parseInt(fields.mode || 2);
        const atomId = parseInt(fields.atomId || 0);
        let imgWidth = 0;
        let imgHeight = 0;

        // dest
        const downloadId = uuid.v4().replace(/-/g, '');
        const _filePath = `file/${mode === 1 ? 'image' : 'file'}/${this.ctx.meta.util.today()}`;
        const _fileName = uuid.v4().replace(/-/g, '');
        const destDir = await this.ctx.meta.file.getPath(_filePath, true);
        const destFile = path.join(destDir, `${_fileName}${fileInfo.ext}`);

        // write
        if (mode === 1) {
          // image
          await bb.fromCallback(cb => {
            let img = gm(stream);
            if (fields.cropped === 'true') {
              const cropbox = JSON.parse(fields.cropbox);
              img = img.crop(parseInt(cropbox.width), parseInt(cropbox.height), parseInt(cropbox.x), parseInt(cropbox.y));
            }
            img.quality(100).write(destFile, cb);
          });
          // size
          const imgSize = await bb.fromCallback(cb => {
            gm(destFile).size(cb);
          });
          imgWidth = imgSize.width;
          imgHeight = imgSize.height;
        } else if (mode === 2) {
          // file
          const writeStream = fs.createWriteStream(destFile);
          await bb.fromCallback(cb => {
            pump(stream, writeStream, cb);
          });
        }

        // fileSize
        const stat = await fse.stat(destFile);
        const fileSize = stat.size;

        // save
        const res = await this.ctx.model.file.insert({
          userId: user.id,
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
        });
        const fileId = res.insertId;

        // ok
        const downloadUrl = this.ctx.meta.file.getUrl(
          `/api/a/file/file/download/${downloadId}${mode === 1 ? fileInfo.ext : ''}`
        );
        return {
          fileId,
          downloadId,
          downloadUrl,
        };

      } catch (e) {
        await sendToWormhole(stream);
        throw e;
      }
    }

    async download({ downloadId, width, height, user }) {
      // downloadId
      if (!downloadId) this.ctx.throw(404);
      const extPos = downloadId.indexOf('.');
      if (extPos > -1) downloadId = downloadId.substr(0, extPos);

      // get file
      const file = await this.ctx.model.file.get({ downloadId });
      if (!file) this.ctx.throw(404);

      // pre
      let fileName = file.fileName;
      if (file.mode === 1) {
        // adjust image
        fileName = await this.adjustImage(file, width, height);
      } else if (file.mode === 2) {
        // check right
        await this.checkRight(file, user);
      }

      // download url
      const downloadUrl = this.ctx.meta.file.getDownloadUrl(
        `${file.filePath}/${fileName}${file.fileExt}`
      );

      // send
      if (app.meta.isTest || app.meta.isLocal) {
        // redirect
        this.ctx.redirect(downloadUrl);
      } else {
        // redirect nginx
        this.ctx.set('content-type', file.mime);
        this.ctx.set('content-transfer-encoding', file.encoding);
        this.ctx.set('content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.realName)}${file.fileExt}`);
        this.ctx.set('X-Accel-Redirect', downloadUrl);
        this.ctx.success();
      }

    }

    async adjustImage(file, widthRequire, heightRequire) {
      widthRequire = widthRequire ? parseInt(widthRequire) : 0;
      heightRequire = heightRequire ? parseInt(heightRequire) : 0;
      if (!widthRequire && !heightRequire) return file.fileName;

      const fileName = `${file.fileName}-${widthRequire}*${heightRequire}`;
      const destFile = await this.ctx.meta.file.getPath(
        `${file.filePath}/${fileName}${file.fileExt}`, false
      );

      const bExists = await fse.pathExists(destFile);
      if (bExists) return fileName;

      const width = widthRequire || parseInt(file.width * heightRequire / file.height);
      const height = heightRequire || parseInt(file.height * widthRequire / file.width);

      const srcFile = await this.ctx.meta.file.getPath(
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

    async checkRight(file, user) {
      // not check if !atomId
      if (!file.atomId) return;
      const res = await this.ctx.meta.atom.checkRightRead({ atom: { id: file.atomId }, user });
      if (!res) this.ctx.throw(403);
    }

  }

  return File;
};
