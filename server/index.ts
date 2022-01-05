import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config/config';
import mongooseConnect from './mongoose/mongoose';
import { api } from './api';
import User, { generateToken } from './models/user/User';
import { generateHash } from './utils/hash';

const BUILD_PATH = path.join(process.cwd(), 'build');

mongooseConnect();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(BUILD_PATH, config.staticOptions));
app.use(express.static(config.upload.path, config.staticOptions));
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(BUILD_PATH + '/index.html');
});

app.listen(config.PORT, async () => {
  const admin = await User.findOne({ username: 'Lilith' });
  if (!admin) {
    await new User({
      username: 'Lilith',
      password: 'dumbleDor',
      token: generateToken('Lilith'),
    }).save();
  }
  console.log(`Server run on :${config.PORT}`);
});
