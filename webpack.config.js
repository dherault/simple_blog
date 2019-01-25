const path = require('path');

module.exports = {
  entry: './front/index.js',
  output: {
    path: path.resolve(__dirname, 'server/public'),
    filename: 'bundle.js',
  },
};
