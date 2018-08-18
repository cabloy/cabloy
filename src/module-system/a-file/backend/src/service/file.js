const path = require('path');
const fs = require('fs');
const require3 = require('require3');
const sendToWormhole = require3('stream-wormhole');
const uuid = require3('uuid');
const gm = require3('gm');
const bb = require3('bluebird');
const pump = require3('pump');

module.exports = app => {

  class File extends app.Service {

    async upload() {
      const stream = await this.ctx.getFileStream();
      try {
        //       filename: 'css_256.png',
        // encoding: '7bit',
        // transferEncoding: '7bit',
        // mime: 'image/png',
        // mimeType: 'image/png',
        // fields: { mode: '1', cropped: 'false' } }

        // info
        const filename = path.basename(stream.filename);
        const fileext = path.extname(filename);
        const encoding = stream.encoding;
        const mime = stream.mime;
        const fields = stream.fields;
        const mode = parseInt(fields.mode);
        const atomId = parseInt(fields.atomId);

        // dest
        const filenamebase = uuid.v4().replace(/-/g, '');
        const destDir = await this.ctx.meta.file.getPath(`file/${mode === 1 ? 'image' : 'file'}/${this.ctx.meta.util.today()}`);
        const destFile = path.join(destDir, `${filenamebase}${fileext}`);

        // save
        if (mode === 1) {
          // image
          await bb.fromCallback(cb => {
            let img = gm(stream);
            if (fields.cropped === 'true') {
              const cropbox = JSON.parse(fields.cropbox);
              img = img.crop(cropbox.width, cropbox.height, cropbox.x, cropbox.y);
            }
            img.quality(100).write(destFile, cb);
          });
        } else if (mode === 2) {
          // file
          const writeStream = fs.createWriteStream(destFile);
          await bb.fromCallback(cb => {
            pump(stream, writeStream, cb);
          });
        }

      } catch (e) {
        await sendToWormhole(stream);
        throw e;
      }
    }

  }

  return File;
};
