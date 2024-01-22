import { addAccount, addSession, getAccount } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { nanoid } from 'nanoid'
import { hash } from '@/server/hash'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  const body = await request.json() as { username: string, displayName?: string, password: string }
  try {
    await Yup.object({
      username: Yup.string()
        .min(1)
        .matches(/^[a-zA-Z0-9_]+$/)
        .max(16)
        .required(),
      displayName: Yup.string()
        .min(1)
        .max(36),
      password: Yup.string()
        .min(1)
        .max(128)
        .required(),
    }).validate(body)
  } catch (error) {
    return json({ ok: false }, { status: 400 })
  }

  const account = await getAccount(body.username)
  if (account) {
    return json({ ok: false, error: 'USERNAME_CONFLICT' })
  }
  
  const passwordHash = await hash(body.password)
  await addAccount({
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    username: body.username,
    displayName: body.displayName,
    createdAt: Date.now(),
    passwordHash,
    bots: [],
  })

  const sessionToken = nanoid()
  await addSession(body.username, sessionToken)
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  request.headers.set('Set-Cookie', [
    cookie.serialize('sessionbots.directory_token', sessionToken, { httpOnly: true, expires }),
    cookie.serialize('sessionbots.directory_token', sessionToken, { httpOnly: false, expires }),
  ].join(';'))

  return json({ ok: true })
}