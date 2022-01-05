import { Schema, model } from 'mongoose';
import shortId from 'short-id';
import { UserDocument, UserModel } from '../../types';
import { generateHash } from '../../utils/hash';

const UserSchema = new Schema({
  username: String,
  hashPassword: String,
  token: String,
});

export const generateToken = (fieldToHash: string = '') => {
  return `${generateHash(fieldToHash)}.${generateHash(shortId.generate())}`;
};

UserSchema.virtual('password').get(function (this: UserDocument) {
  return this.hashPassword;
});
UserSchema.virtual('password').set(function (this: UserDocument, password) {
  this.hashPassword = generateHash(password);
});

UserSchema.statics.isTokenValid = function (user?: UserDocument) {
  if (!user) return false;

  const checkedField = generateToken(user.username).split('.')[0];
  return checkedField === user.username;
};
UserSchema.statics.isPasswordValid = function (
  password: string,
  hashPassword: string
) {
  if (!password || !hashPassword) return false;
  return generateHash(password) === hashPassword;
};

export default model<UserDocument, UserModel>('User', UserSchema);
