import Redis, { RedisKey } from 'ioredis'

const redisClient = new Redis({
  port: 6714,
  host: '127.0.0.1'
})

type DB = {
  get: typeof redisClient.get,
  put: typeof redisClient.set,
  del: (...keys: RedisKey[]) => ReturnType<typeof redisClient.del>,
  keys: () => ReturnType<typeof redisClient.keys>,
  mget: (keys: RedisKey[]) => ReturnType<typeof redisClient.mget>,
}

const dbNames = ['accounts', 'sessions', 'bots', 'verifications'] as const

export function getDb(dbName: typeof dbNames[number]): DB {
  if (!dbNames.includes(dbName)) throw new Error(`Invalid db name: ${dbName}`)

  return {
    get: (key) => redisClient.get(`${dbName}:${key}`),
    put: (key, value) => redisClient.set(`${dbName}:${key}`, value),
    del: (...keys: RedisKey[]) => redisClient.del(keys.map(key => `${dbName}:${key}`)),
    keys: async () => (await redisClient.keys(`${dbName}:*`)).map(key => key.replace(`${dbName}:`, '')),
    mget: async (keys: RedisKey[]) => keys.length ? await redisClient.mget(...keys.map(key => `${dbName}:${key}`)) : []
  }
}

process.on('sigint', async () => {
  await redisClient.disconnect()
})