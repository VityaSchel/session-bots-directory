import { getDb } from '@/db'
import { deleteBotFromAuthor, getAccount, pushNewBot } from '@/server/auth'
import { Bot } from '@/shared/model/bot'
import { Level } from 'level'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const botsDb = await getDb('bots')
export let bots = Array.from(await botsDb.values().all()).map(bot => JSON.parse(bot) as Bot)

export async function searchBots({ query, sort }: {
  query: string | null
  sort: string | null
}): Promise<Bot[]> {
  let results = bots
    .filter(b => b.visible)
  if(query) {
    results = results.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.description?.toLowerCase().includes(query.toLowerCase()))
  }
  if(sort) {
    if(sort === 'oldest') {
      results = results.sort((a, b) => a.createdAt - b.createdAt)
    } else {
      results = results.sort((a, b) => b.createdAt - a.createdAt)
    }
  }
  return results
}

export async function getBots(botIds: string[]): Promise<Bot[]> {
  const botsDb = await getDb('bots')
  const bots = await botsDb.getMany(botIds)
  return bots
    .filter(Boolean)
    .map(bot => JSON.parse(bot) as Bot)
}

export async function getBot(botId: string): Promise<Bot | null> {
  const botsDb = await getDb('bots')
  try {
    if (!botId) return null
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

export async function deleteBots(botsIds: string[]) {
  const botsDb = await getDb('bots')
  await botsDb.batch(botsIds.map(id => ({ type: 'del', key: id })))
  bots = bots.filter(b => !botsIds.includes(b.id))
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
  const index = bots.findIndex(b => b.id === botId)
  bots[index] = bot
}