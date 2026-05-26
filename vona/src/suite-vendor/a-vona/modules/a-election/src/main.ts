import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    const redisElection = this.app.bean.redis.get('worker');
    redisElection.defineCommand('electionObtain', {
      numberOfKeys: 2,
      lua: `
local workerExists=redis.call('HEXISTS',KEYS[1],ARGV[1])
-- if workerExists == 1 then return nil end
local workers=redis.call('HKEYS',KEYS[1])
local workersDead={}
for k, v in pairs(workers) do
  local workerIdCheck=KEYS[2] .. v
  local alive=redis.call('GET',workerIdCheck)
  if alive ~= 'true' then
    redis.call('HDEL',KEYS[1],v)
    workersDead[#workersDead + 1]=v  
  end
end
local leader=0
if (#workers - #workersDead) < tonumber(ARGV[2]) then
  leader=1
  redis.call('HSET',KEYS[1],ARGV[1],1)
end
return {leader,workersDead}
`,
    });
  }

  async configLoaded(_config: any) {}
}
