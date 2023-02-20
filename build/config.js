/** @module project/build/config */

/** backend
 * @property {object} backend
 * @property {string} backend.hostname='0.0.0.0'
 * @property {number} backend.port=7102
 */
const backend = {
  port: 7102,
  hostname: '0.0.0.0',
  maintenance: false, // true,
};

/** front
 * @property {object} front
 * @property {object} front.build - npm run build:front
 * @property {boolean} front.build.productionSourceMap=true
 * @property {boolean} front.build.uglify=true
 * @property {object} front.dev - npm run dev:front
 * @property {string} front.dev.hostname='localhost'
 * @property {number} front.dev.port=9192
 * @property {string} front.dev.proxyBaseURL='http://localhost:7102'
 */
const front = {
  build: {
    productionSourceMap: true,
    uglify: true,
  },
  dev: {
    // hostname: 'localhost',
    // hostname: 'b.test.com',
    // hostname: '192.168.0.100',
    // hostname: '192.168.0.102',
    port: 9192,
    // proxyBaseURL: 'http://localhost:7102',
  },
};

module.exports = {
  front,
  backend,
};
