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
    port: 9192,
    // proxyBaseURL: 'http://localhost:7002',
  },
};

module.exports = {
  front,
  backend,
};
