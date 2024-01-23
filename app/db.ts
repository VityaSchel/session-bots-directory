import { Level } from 'level'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const dbs = new Map<string, Level<string, string>>()

export async function getDb(dbName: string) {
  const dbNames = ['accounts', 'sessions', 'bots']
  if (!dbNames.includes(dbName)) throw new Error(`Invalid db name: ${dbName}`)
  if(dbs.has(dbName)) {
    const db = dbs.get(dbName)!
    if (db.status !== 'open') {
      try {
        await db.open()
      } catch(e) {
        if(e instanceof Error)
          console.error(e.code, e.message)
        else
          console.error(e)
      }
    }
    return db
  } else {
    const db = new Level(__dirname + `../db/${dbName}`, { valueEncoding: 'json' })
    dbs.set(dbName, db)
    return db
  }
}

process.on('sigint', async () => {
  const levelDbs = dbs.values()
  for (const db of levelDbs) {
    await db.close()
  }
})