// title
const title = '{{name}}';

// backend
const backend = {
  port: 7002,
  hostname: '127.0.0.1',
};

// front
const front = {
  build: {
    title,
    productionSourceMap: false,
    uglify: true,
  },
  dev: {
    title,
    port: 9092,
  },
};

module.exports = {
  front,
  backend,
};
