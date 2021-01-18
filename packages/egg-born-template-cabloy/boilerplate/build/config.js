// backend
const backend = {
  port: 7002,
  hostname: '0.0.0.0',
};

// front
const front = {
  build: {
    productionSourceMap: false,
    uglify: true,
  },
  dev: {
    // hostname: 'localhost',
    port: 9092,
    // proxyBaseURL: 'http://localhost:7002',
  },
};

module.exports = {
  front,
  backend,
};
