import fs from 'fs';
import shellJs from 'shelljs';

export const checkFolderExist = (path: string) => {
  try {
    fs.statSync(path);
  } catch (e) {
    return shellJs.mkdir(path);
  }
};
