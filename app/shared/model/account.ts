export type Account = {

}

export type AccountSchema = {
  id: number
  username: string
  displayName?: string
  createdAt: number
  passwordHash: string
  bots: string[]
}