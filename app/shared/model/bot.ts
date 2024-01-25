export type Bot = BotSchema

export type BotSchema = {
  id: string
  author: string
  name: string
  description?: string
  createdAt: number
  status: 'online' | 'offline'
  visible: boolean
  views: number
  checksFails: number
  lastChecked: number
}