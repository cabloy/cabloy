// title
const title = 'cabloy';

// backend
const backend = {
  port: 7102,
  hostname: '0.0.0.0',
};

// front
const front = {
  build: {
    title,
    productionSourceMap: true,
    uglify: true,
  },
  dev: {
    title,
    // hostname: 'localhost',
    port: 9192,
    // proxyBaseURL: 'http://localhost:7002',
  },
};

// general
const general = {
  disabledModules: [
    // 'test-party',
  ],
};

module.exports = {
  front,
  backend,
  general,
};
