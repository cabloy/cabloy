import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';

const LUA_ADMIT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('PTTL', KEYS[1])
if ttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return { current, ttl }
`;

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    this.app.bean.redis.get('limiter').defineCommand('rateLimitAdmit', {
      numberOfKeys: 1,
      lua: LUA_ADMIT,
    });
  }

  async configLoaded(_config: any) {}
}
