import { Document, Model } from 'mongoose';

export interface UserDocument extends Document {
  _doc: UserModel;
  _id: string;
  username: string;
  hashPassword: string;
  token: string;
}

export interface UserModel extends Model<UserDocument> {
  isPasswordValid: (pass: string, hashPass: string) => boolean;
  isTokenValid: (user: UserModel) => boolean;
}
