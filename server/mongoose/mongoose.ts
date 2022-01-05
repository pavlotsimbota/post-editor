const mongoose = require('mongoose');
import { config } from '../config/config';

// mongoose.set('debug', true);

const mongooseProps = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const mongooseConnect = () => {
  mongoose.connect(
    `mongodb://localhost/${config.DB_NAME}`,
    mongooseProps,
    async err => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('-- Mongoose connect --');
      }
    }
  ),
    config.mongoose.options;
};

export default mongooseConnect;
