import { getDb } from '@/db'
import { Bot } from '@/shared/model/bot'
import { Level } from 'level'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const botsDb = await getDb('bots')
let bots = [] as Bot[]//Array.from(await botsDb.values().all()).map(bot => JSON.parse(bot) as Bot)

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
  const bots = await botsDb.getMany(botIds)
  return bots.map(bot => JSON.parse(bot) as Bot)
}