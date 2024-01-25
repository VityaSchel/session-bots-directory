import { getDb } from '@/db'
import { deleteBotFromAuthor, pushNewBot } from '@/server/auth'
import { Bot } from '@/shared/model/bot'

const botsDb = await getDb('bots')

export async function getAllBots(): Promise<Bot[]> {
  return Array.from(
    await botsDb.mget(
      await botsDb.keys()
    )
  ).map(value => JSON.parse(value as string) as Bot)
}

export async function searchBots({ query, sort }: {
  query: string | null
  sort: string | null
}): Promise<Bot[]> {
  const bots = await getAllBots()
  let results = bots
    .filter(b => b.visible)
  if(query) {
    results = results.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.description?.toLowerCase().includes(query.toLowerCase()))
  }
  if(sort) {
    if(sort === 'oldest') {
      results = results.sort((a, b) => a.createdAt - b.createdAt)
    } else if(sort === 'newest') {
      results = results.sort((a, b) => b.createdAt - a.createdAt)
    } else if(sort === 'popular') {
      results = results.sort((a, b) => {
        if (b.views - a.views !== 0) {
          return b.views - a.views
        }
        return Number(b.status === 'online') - Number(a.status === 'online')
      })
    }
  }
  return results
}

export async function getBots(botIds: string[]): Promise<Bot[]> {
  const botsDb = await getDb('bots')
  const bots = await botsDb.mget(botIds)
  return bots
    .filter(Boolean)
    .map(bot => JSON.parse(bot as string) as Bot)
}

export async function getBot(botId: string): Promise<Bot | null> {
  const botsDb = await getDb('bots')
  if (!botId) return null
  const existingBot = await botsDb.get(botId)
  if (!existingBot) return null
  return JSON.parse(existingBot) as Bot
}

export async function addBot(bot: Bot) {
  const existingBot = await getBot(bot.id)
  if (existingBot) {
    await deleteBotFromAuthor(bot.author, bot.id)
  }
  const botsDb = await getDb('bots')
  await botsDb.put(bot.id, JSON.stringify(bot))
  pushNewBot(bot.author, bot.id)
}

export async function deleteBots(botsIds: string[]) {
  const botsDb = await getDb('bots')
  await botsDb.del(...botsIds)
}

export async function updateBot<E extends keyof Bot>(botId: string, property: E, newValue: Bot[E]) {
  const bot = await getBot(botId)
  if (!bot) return
  if(newValue === undefined) {
    delete bot[property]
  } else {
    bot[property] = newValue
  }
  await botsDb.put(botId, JSON.stringify(bot))
}