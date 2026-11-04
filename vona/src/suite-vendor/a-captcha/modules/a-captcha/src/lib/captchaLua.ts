export const captchaCasLua = `
local current = redis.call('GET', KEYS[1])
if current ~= ARGV[1] then return 0 end
if ARGV[2] == '' then
  redis.call('DEL', KEYS[1])
else
  local ttl = tonumber(ARGV[3])
  if ttl > 0 then
    redis.call('SET', KEYS[1], ARGV[2], 'PX', ttl)
  else
    redis.call('SET', KEYS[1], ARGV[2], 'KEEPTTL')
  end
end
return 1
`;

export const captchaProofLua = `
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
local current = redis.call('GET', KEYS[1])
if ARGV[1] == '' then
  if current then return { 0, now, 0 } end
elseif current ~= ARGV[1] then
  return { 0, now, 0 }
end
local expiresAt = now + tonumber(ARGV[3])
redis.call('SET', KEYS[1], ARGV[2])
redis.call('PEXPIREAT', KEYS[1], expiresAt)
return { 1, now, expiresAt }
`;

export const captchaPublishLua = `
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
local expiresAt = tonumber(ARGV[2])
if expiresAt <= now then return { 0, now } end
local current = redis.call('GET', KEYS[1])
if current then
  if current ~= ARGV[1] then return { -1, now } end
  local ttl = redis.call('PTTL', KEYS[1])
  if ttl > 0 then expiresAt = math.max(expiresAt, now + ttl) end
end
redis.call('SET', KEYS[1], ARGV[1])
redis.call('PEXPIREAT', KEYS[1], expiresAt)
return { 1, now }
`;
