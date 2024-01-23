import { addAccount, addSession, getAccount, resolveSession } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { nanoid } from 'nanoid'
import { hash } from '@/server/hash'
import { addBot, getBot, getBots } from '@/server/bots'
import { getDb } from '@/db'
import { verifyBot, getVerification } from '@/server/verification'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  const body = await request.json() as { sessionID: string, name: string, description?: string}
  try {
    await Yup.object({
      sessionID: Yup.string()
        .matches(/^[a-f0-9]{66}$/)
        .required(),
      name: Yup.string()
        .max(28)
        .required(),
      description: Yup.string()
        .min(1)
        .max(200),
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

  const verification = await getVerification(body.sessionID)
  if (!verification || verification.userId !== account.id) {
    return json({ ok: false, error: 'REQUEST_VERIFICATION_FIRST' })
  }

  const isVerified = await verifyBot(body.sessionID, account.id)
  if(!isVerified) {
    return json({ ok: false, error: 'INVALID_VERIFICATION' })
  }

  await addBot({
    id: body.sessionID,
    name: body.name,
    description: body.description || '',
    author: account.username,
    createdAt: Date.now(),
    views: 0,
    status: 'offline',
    visible: true
  })

  return json({ ok: true })
}