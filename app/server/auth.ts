import { Level } from 'level'
import { AccountSchema } from '@/shared/model/account'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const accounts = new Level(__dirname + '/../../db/accounts', { valueEncoding: 'json' })
const sessions = new Level(__dirname + '/../../db/sessions', { valueEncoding: 'json' })

export async function getAccount(username: string): Promise<AccountSchema | null> {
  try {
    const account = await accounts.get(username)
    return JSON.parse(account) as AccountSchema
  } catch (error) {
    if(error instanceof Error) {
      if('code' in error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
          return null
        }
      }
    }
    throw error
  }
}

export async function addAccount(account: AccountSchema): Promise<void> {
  await accounts.put(account.username, JSON.stringify(account))
}

export async function deleteAccount(username: string) {
  await accounts.del(username)
}

export async function updateDisplayName(username: string, newDisplayName: string) {
  const account = await getAccount(username)
  if(account) {
    await accounts.put(username, JSON.stringify({ ...account, displayName: newDisplayName } as AccountSchema))
  }
}

export async function updatePassword(username: string, newPassword: string) {
  const account = await getAccount(username)
  if(account) {
    await accounts.put(username, JSON.stringify({ ...account, password: newPassword } as AccountSchema))
  }
}

export async function pushNewBot(username: string, newBotID: string) {
  const account = await getAccount(username)
  if(account) {
    await accounts.put(username, JSON.stringify({ ...account, bots: account.bots.concat(newBotID) } as AccountSchema))
  }
}

export async function deleteBot(username: string, botID: string) {
  const account = await getAccount(username)
  if(account) {
    await accounts.put(username, JSON.stringify({ ...account, bots: account.bots.filter(b => b !== botID) } as AccountSchema))
  }
}

export async function addSession(username: string, token: string) {
  await sessions.put(token, username)
}

export async function deleteSession(token: string) {
  await sessions.del(token)
}