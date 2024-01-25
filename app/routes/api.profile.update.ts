import { deleteAccount, getAccount, resolveSession } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { hash } from '@/server/hash'
import { deleteBots } from '@/server/bots'
import { getDb } from '@/db'
import { isSafe } from '@/server/moderation'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  if(request.method === 'POST') {
    const body = await request.json() as { newPassword?: string, newDisplayName?: string }
    try {
      await Yup.object({
        newPassword: Yup.string()
          .min(1)
          .max(128),
        newDisplayName: Yup.string()
          .max(36),
      }).validate(body)
    } catch (error) {
      return json({ ok: false }, { status: 400 })
    }

    const cookies = cookie.parse(request.headers.get('Cookie') || '')
    const sessionToken = cookies['sessionbots.directory_token']
    const username = sessionToken && await resolveSession(sessionToken)
    if (!username) {
      return json({ ok: false }, { status: 401 })
    }
    const account = await getAccount(username)
    if (!account) {
      return json({ ok: false }, { status: 401 })
    }

    const accounts = await getDb('accounts')

    if(body.newDisplayName !== undefined) {
      const newDisplayName = body.newDisplayName.trim()
      if(newDisplayName === '') {
        const { displayName: _, ...accountWithNoDisplayName } = account
        await accounts.put(username, JSON.stringify(accountWithNoDisplayName))
      } else {
        const isDisplayNameSafe =await isSafe(newDisplayName)
        if (!isDisplayNameSafe) {
          return json({ ok: false, error: 'DISPLAY_NAME_NOT_SAFE' })
        }
        await accounts.put(username, JSON.stringify({ ...account, displayName: newDisplayName }))
      }
    }

    if(body.newPassword) {
      const hashedPassword = await hash(body.newPassword)
      await accounts.put(username, JSON.stringify({ ...account, passwordHash: hashedPassword }))
    }

    return json({ ok: true })
  } else if(request.method === 'DELETE') {
    const cookies = cookie.parse(request.headers.get('Cookie') || '')
    const sessionToken = cookies['sessionbots.directory_token']
    const username = sessionToken && await resolveSession(sessionToken)
    if (!username) {
      return json({ ok: false }, { status: 401 })
    }
    const account = await getAccount(username)
    if (!account) {
      return json({ ok: false }, { status: 401 })
    }
    
    await deleteAccount(account.username)
    await deleteBots(account.bots)

    const headers = new Headers()
    headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_token', '', { httpOnly: true, expires: new Date(0), path: '/' }))
    headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_authorized', '', { httpOnly: true, expires: new Date(0), path: '/' }))

    return json({ ok: true }, { headers })
  } else {
    return json({ ok: false }, { status: 405 })
  }
}