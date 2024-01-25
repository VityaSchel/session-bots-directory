import { AccountSchema } from '@/shared/model/account'
import { getDb } from '@/db'

export async function getAccount(username: string): Promise<AccountSchema | null> {
  const accounts = await getDb('accounts')
  if (!username) return null
  const account = await accounts.get(username)
  if (!account) return null
  return JSON.parse(account) as AccountSchema
}

export async function addAccount(account: AccountSchema): Promise<void> {
  const accounts = await getDb('accounts')
  await accounts.put(account.username, JSON.stringify(account))
}

export async function deleteAccount(username: string) {
  const accounts = await getDb('accounts')
  await accounts.del(username)
}

export async function updateDisplayName(username: string, newDisplayName: string) {
  const account = await getAccount(username)
  if(account) {
    const accounts = await getDb('accounts')
    await accounts.put(username, JSON.stringify({ ...account, displayName: newDisplayName } as AccountSchema))
  }
}

export async function updatePassword(username: string, newPassword: string) {
  const account = await getAccount(username)
  if(account) {
    const accounts = await getDb('accounts')
    await accounts.put(username, JSON.stringify({ ...account, password: newPassword } as AccountSchema))
  }
}

export async function pushNewBot(username: string, newBotID: string) {
  const account = await getAccount(username)
  if(account) {
    const accounts = await getDb('accounts')
    await accounts.put(username, JSON.stringify({ ...account, bots: account.bots.concat(newBotID) } as AccountSchema))
  }
}

export async function deleteBotFromAuthor(username: string, botID: string) {
  const account = await getAccount(username)
  if(account) {
    const accounts = await getDb('accounts')
    await accounts.put(username, JSON.stringify({ ...account, bots: account.bots.filter(b => b !== botID) } as AccountSchema))
  }
}

export async function addSession(username: string, token: string) {
  const sessions = await getDb('sessions')
  await sessions.put(token, username)
}

export async function deleteSession(token: string) {
  const sessions = await getDb('sessions')
  await sessions.del(token)
}

export async function resolveSession(token: string) {
  const sessions = await getDb('sessions')
  if (!token) return null
  const username = await sessions.get(token)
  return username
}