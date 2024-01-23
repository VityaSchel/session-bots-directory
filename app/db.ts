import { Level } from 'level'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const dbs = new Map<string, Level<string, string>>()

export async function getDb(dbName: string) {
  const dbNames = ['accounts', 'sessions', 'bots', 'verifications']
  if (!dbNames.includes(dbName)) throw new Error(`Invalid db name: ${dbName}`)

  let db: Level<string, string>

  if(dbs.has(dbName)) {
    db = dbs.get(dbName)!
  } else {
    db = new Level(__dirname + `../db/${dbName}`, { valueEncoding: 'json' })
    dbs.set(dbName, db)
  }

  if(db.status === 'opening')
    await new Promise(resolve => db.once('ready', resolve))

  return db
}

process.env.NODE_ENV === 'production' && process.on('sigint', async () => {
  const levelDbs = dbs.values()
  for (const db of levelDbs) {
    if(db.status === 'open') {
      await db.close()
    }
  }
})