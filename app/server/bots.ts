import { Bot } from '@/shared/model/bot'
import { Level } from 'level'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const bots = new Level(__dirname + '../db/bots', { valueEncoding: 'json' })
await bots.open()

export async function searchBots({ query, sort }: {
  query: string | null
  sort: string | null
}): Promise<Bot[]> {
  let bots = [
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'орфырфыворфыовдофыодлвфов', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt18723612', name: 'test', author: 'Aboba', description: '', createdAt: new Date('2023-01-03').getTime() },
    { id: 'asuhkdkasdgasbukdbt1872361', name: 'test', author: 'Aboba', description: 'орфыров', createdAt: new Date('2023-01-02').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236', name: 'test', author: 'Aboba', description: 'орфыров', createdAt: new Date('2023-01-04').getTime() },
    { id: 'asuhkdkasdgasbukdbt18723', name: 'test', author: 'Aboba', description: 'фыдовофлыволдфылдоволдфывдлофдолыводлфыдолвфдлоыв', createdAt: new Date('2023-01-05').getTime() },
    { id: 'asuhkdkasdgasbukdbt1872', name: 'test', author: 'Aboba', description: 'Кожанная сумка оловяные солдатникиии Кожанная сумка оловяный солдатик ', createdAt: new Date('2023-01-06').getTime() },
    { id: 'asuhkdkasdgasbukdbt187', name: 'test', author: 'Aboba', description: 'Бот не даст вам соскучиться, пиши развлекайся', createdAt: new Date('2023-01-07').getTime() },
    { id: 'asuhkdkasdgasbukdbt18', name: 'test', author: 'Aboba', description: 'Анонимный чат со случайными людьми из Session. Команды: /start — то то то, то то то, то то то. Опенсорс. Репозиторий: https://github.com/vityaschel/session-random-chat-bot. Создатель: hloth.dev', createdAt: new Date('2023-01-08').getTime() },
  ]
  if(query) {
    bots = bots.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.description.toLowerCase().includes(query.toLowerCase()))
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