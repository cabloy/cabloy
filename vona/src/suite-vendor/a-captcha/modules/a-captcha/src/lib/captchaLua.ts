// All keys are supplied through the existing captcha cache owner. Bound keys share
// one instance hash tag; image transitions use their original single key.
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

export const captchaReserveLua = `
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
local policy = cjson.decode(ARGV[2])
local cooldown = tonumber(redis.call('GET', KEYS[3]) or '0')
local retryAt = cooldown
local counters = {}
for i, budget in ipairs(policy.budgets) do
  local value = tonumber(redis.call('GET', KEYS[i + 3]) or '0')
  local deadline = (math.floor(now / budget.windowMs) + 1) * budget.windowMs
  local remaining = redis.call('PTTL', KEYS[i + 3])
  if remaining <= 0 then value = 0 end
  counters[i] = { value = value, deadline = deadline }
  if value >= budget.limit and deadline > retryAt then retryAt = deadline end
end
if retryAt > now then return { 0, '', retryAt, cooldown } end
if redis.call('EXISTS', KEYS[1]) == 1 then return { -1 } end
local data = cjson.decode(ARGV[3])
data.bound.expiresAt = now + policy.ttl
data.bound.resendAt = now + policy.cooldown
local raw = cjson.encode(data)
for i, counter in ipairs(counters) do
  redis.call('SET', KEYS[i + 3], tostring(counter.value + 1))
  redis.call('PEXPIREAT', KEYS[i + 3], counter.deadline)
end
redis.call('SET', KEYS[1], raw)
redis.call('PEXPIREAT', KEYS[1], data.bound.expiresAt)
redis.call('SET', KEYS[2], ARGV[1])
redis.call('PEXPIREAT', KEYS[2], math.max(data.bound.expiresAt, data.bound.resendAt))
if policy.cooldown > 0 then
  redis.call('SET', KEYS[3], tostring(data.bound.resendAt))
  redis.call('PEXPIREAT', KEYS[3], data.bound.resendAt)
end
return { 1, raw, data.bound.expiresAt, data.bound.resendAt }
`;

export const captchaFinalizeLua = `
local current = redis.call('GET', KEYS[1])
if current ~= ARGV[1] or redis.call('GET', KEYS[2]) ~= ARGV[2] then return 0 end
local data = cjson.decode(current)
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
if data.bound.state ~= 'pending' or data.bound.expiresAt <= now then return 0 end
if ARGV[3] == '' then
  redis.call('DEL', KEYS[1])
else
  redis.call('SET', KEYS[1], ARGV[3])
  redis.call('PEXPIREAT', KEYS[1], data.bound.expiresAt)
end
return 1
`;

// Verification happens in the provider. Only the caller holding this exact active
// snapshot can commit its verdict, so success cannot race refresh or another use.
export const captchaConsumeLua = `
local current = redis.call('GET', KEYS[1])
if current ~= ARGV[1] then return -1 end
if redis.call('GET', KEYS[2]) ~= ARGV[2] then return 0 end
local data = cjson.decode(current)
local time = redis.call('TIME')
local now = tonumber(time[1]) * 1000 + math.floor(tonumber(time[2]) / 1000)
if data.bound.state ~= 'active' or data.bound.expiresAt <= now or data.bound.attemptsRemaining <= 0 then
  return 0
end
if ARGV[3] == '1' or data.bound.attemptsRemaining == 1 then
  redis.call('DEL', KEYS[1])
else
  redis.call('SET', KEYS[1], ARGV[4])
  redis.call('PEXPIREAT', KEYS[1], data.bound.expiresAt)
end
return 1
`;
