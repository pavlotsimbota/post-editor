import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { File } from '../../models';
import { config } from '../../config/config';
import { uploadFile } from './helpers';

export const uploadRoute = Router();

uploadRoute.get('/', async (req, res) => {
  try {
    const { offset = 0, limit = 0 } = req.query;
    const files = await File.find({})
      .sort([['createdAt', -1]])
      .skip(Number(offset))
      .limit(Number(limit));
    const count = await File.find({}).count();

    res.json({
      files: files.map(({ _doc }) => ({
        ..._doc,
        filePath: `${config.ownAddress}${_doc.filePath}`,
      })),
      count,
    });
  } catch (e: any) {
    res.status(500).json({ message: e.messgae });
  }
});

uploadRoute.post('/', async (req, res) => {
  try {
    const file: any = await uploadFile(req);
    const savedFile = await new File(file).save();
    res.json({
      file: {
        ...savedFile._doc,
        filePath: `${config.ownAddress}${savedFile.filePath}`,
      },
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.messgae });
  }
});

uploadRoute.delete('/', async (req, res) => {
  const file = await File.findByIdAndDelete(req.body.id, { new: true });
  try {
    if (file) {
      fs.unlinkSync(path.join(config.upload.path, file.filePath));
    }
    res.json({ file });
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      res.json({ file });
    } else {
      res.status(500).json({ message: e.messgae });
    }
  }
});
