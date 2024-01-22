import { Bot } from '@/model/bot'

export async function searchBots({ query, sort }: {
  query: string | null
  sort: string | null
}): Promise<Bot[]> {
  return [
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'орфырфыворфыовдофыодлвфов', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: '', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'орфыров', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'орфыров', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'фыдовофлыволдфылдоволдфывдлофдолыводлфыдолвфдлоыв', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'Кожанная сумка оловяные солдатникиии Кожанная сумка оловяный солдатик ', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'Бот не даст вам соскучиться, пиши развлекайся', createdAt: new Date('2023-01-01').getTime() },
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'Анонимный чат со случайными людьми из Session. Команды: /start — то то то, то то то, то то то. Опенсорс. Репозиторий: https://github.com/vityaschel/session-random-chat-bot. Создатель: hloth.dev', createdAt: new Date('2023-01-01').getTime() },
  ]
}