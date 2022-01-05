import { Schema, model } from 'mongoose';
import { FileModel } from '../../types';

const FileSchema = new Schema(
  {
    filename: String,
    filePath: String,
    meta: {
      width: Number,
      height: Number,
    },
  },
  { timestamps: true }
);

export default model<FileModel>('file', FileSchema);
