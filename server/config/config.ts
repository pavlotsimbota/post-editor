import path from 'path';

export const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
};

export const config = {
  PORT: process.env.PORT || 3000,
  DB_NAME: process.env.DB_NAME || 'pfd_upload',
  ownAddress: `http://localhost:${process.env.PORT || 3000}`,
  session: {
    secret: 'nodeJSForever',
    key: 'sid',
    cookie: {
      name: 'session',
      keys: ['key1', 'key2'],
      maxAge: 10000,
    },
  },
  mongoose: {
    options: {
      server: {
        socketOptions: {
          keepAlive: 1,
        },
      },
    },
  },
  aws: {
    accessKeyId: 'AKIAWEYNYW266H5EGFP5',
    secretAccessKey: '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',
    region: 'eu-central-1',
    bucketName: 'mafitmedia',
  },
  hash: {
    secret: 'secretsalt',
    salt: 10,
  },
  upload: {
    path: path.join(process.cwd(), 'UPLOAD'),
  },
  staticOptions: {
    maxAge: 1000 * 60 * 60 * 24 * 90,
  },
};
