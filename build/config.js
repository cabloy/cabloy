// backend
const backend = {
  port: 7102,
  hostname: '0.0.0.0',
};

// front
const front = {
  build: {
    productionSourceMap: true,
    uglify: true,
  },
  dev: {
    // hostname: 'localhost',
    hostname: 'b.test.com',
    port: 9192,
    // proxyBaseURL: 'http://localhost:7102',
  },
};

module.exports = {
  front,
  backend,
};
