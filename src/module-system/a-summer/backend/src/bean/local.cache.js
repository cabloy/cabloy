const objectHash = require('object-hash');
const CacheBase = require('../common/cacheBase.js');

// const moduleInfo = module.info;
module.exports = class LocalCache extends CacheBase(ctx) {
  constructor({ cacheBase }) {
    super({ cacheBase });
  }

  async get(key, options) {
    const keyHash = this.__getKeyHash(key);
    const layered = this.__getLayered(options);
    return await layered.get(keyHash, key, options);
  }

  async mget(keys, options) {
    if (!keys || keys.length === 0) {
      return [];
    }
    const keysHash = this.__getKeysHash(keys);
    const layered = this.__getLayered(options);
    return await layered.mget(keysHash, keys, options);
  }

  async del(key, options) {
    const keyHash = this.__getKeyHash(key);
    const layered = this.__getLayered(options);
    return await layered.del(keyHash, key, options);
  }

  async mdel(keys, options) {
    if (!keys || keys.length === 0) {
      return [];
    }
    const keysHash = this.__getKeysHash(keys);
    const layered = this.__getLayered(options);
    return await layered.mdel(keysHash, keys, options);
  }

  async clear(options) {
    const layered = this.__getLayered(options);
    return await layered.clear(options);
  }

  async peek(key, options) {
    const keyHash = this.__getKeyHash(key);
    const layered = this.__getLayered(options);
    return await layered.peek(keyHash, key, options);
  }

  __getLayered(options) {
    if (!this.configModule.summer.enable) {
      return this.localFetch;
    }
    const mode = this.__getOptionsMode(options);
    if (mode === 'all' || mode === 'mem') {
      return this.localMem;
    }
    return this.localRedis;
  }

  __getKeyHash(key) {
    if (key === undefined || key === null) {
      throw new Error('key is required');
    }
    if (Array.isArray(key) || typeof key === 'object') {
      key = objectHash(key, { respectType: false });
    } else if (typeof key !== 'string') {
      key = String(key);
    }
    return key;
  }

  __getKeysHash(keys) {
    return keys.map(key => this.__getKeyHash(key));
  }
};
