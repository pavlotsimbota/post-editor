export type FileModel = {
  _id: string;
  _doc: FileModel;
  filename: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
};
