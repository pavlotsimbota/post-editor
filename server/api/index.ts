import { Router } from 'express';
import { uploadRoute } from './upload/upload';
import { userRoute } from './user/user';

export const api = Router();

api.use('/upload', uploadRoute);
api.use('/user', userRoute);
