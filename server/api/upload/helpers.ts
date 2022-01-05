import fs from 'fs';
import shortID from 'short-id';
import multiparty from 'multiparty';
import { checkFolderExist } from '../../utils/file';
import { config } from '../../config/config';

export const uploadFile = req => {
  const form = new multiparty.Form();
  return new Promise((res, rej) => {
    let fileUrl = '';
    let fileMeta = { width: 0, height: 0 };
    form.on('part', async (part, data) => {
      if (!part.filename) {
        if (part.name === 'meta') {
          fileMeta = req.query;
        }
        part.resume();
        return;
      }
      part.on('error', function (err) {
        rej(err);
      });

      try {
        await checkFolderExist(config.upload.path);
        const filename = shortID.generate();
        const ext = part.filename.split('.').reverse()[0];
        const filePath = `${config.upload.path}/${filename}.${ext}`;
        await part.pipe(fs.createWriteStream(filePath));
        fileUrl = filePath.replace(config.upload.path, '');
      } catch (e) {
        part.emit('error', e);
      }
    });

    form.on('close', function () {
      res({
        filePath: fileUrl,
        meta: fileMeta,
      });
    });
    form.on('error', function (e) {
      rej(e);
    });

    form.parse(req);
  });
};
