import { getDb } from '@/db'
import { deleteBotFromAuthor, getAccount, pushNewBot } from '@/server/auth'
import { Bot } from '@/shared/model/bot'
import { Level } from 'level'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const botsDb = await getDb('bots')
let bots = Array.from(await botsDb.values().all()).map(bot => JSON.parse(bot) as Bot)

export async function searchBots({ query, sort }: {
  query: string | null
  sort: string | null
}): Promise<Bot[]> {
  if(query) {
    bots = bots.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.description?.toLowerCase().includes(query.toLowerCase()))
  }
  if(sort) {
    if(sort === 'oldest') {
      bots = bots.sort((a, b) => a.createdAt - b.createdAt)
    } else {
      bots = bots.sort((a, b) => b.createdAt - a.createdAt)
    }
  }
  return bots
}

export async function getBots(botIds: string[]): Promise<Bot[]> {
  const botsDb = await getDb('bots')
  const bots = await botsDb.getMany(botIds)
  return bots.map(bot => JSON.parse(bot) as Bot)
}

export async function getBot(botId: string): Promise<Bot | null> {
  const botsDb = await getDb('bots')
  try {
    const existingBot = await botsDb.get(botId)
    return JSON.parse(existingBot) as Bot
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
          return null
        }
      }
    }
    throw error
  }
}

export async function addBot(bot: Bot) {
  const existingBot = await getBot(bot.id)
  if (existingBot) {
    const index = bots.findIndex(b => b.id === bot.id)
    if (index !== -1) {
      bots.splice(index, 1)
    }
    await deleteBotFromAuthor(bot.author, bot.id)
  }
  const botsDb = await getDb('bots')
  await botsDb.put(bot.id, JSON.stringify(bot))
  bots.push(bot)
  pushNewBot(bot.author, bot.id)
}