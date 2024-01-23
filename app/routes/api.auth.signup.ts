import { addAccount, addSession, getAccount } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { nanoid } from 'nanoid'
import { hash } from '@/server/hash'
import { isSafe } from '@/server/moderation'

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

  const usernameIsSafe = await isSafe(body.username)
  if (!usernameIsSafe) {
    return json({ ok: false, error: 'USERNAME_NOT_SAFE' })
  }
  if (body.displayName) {
    const displayNameIsSafe = await isSafe(body.displayName)
    if (!displayNameIsSafe) {
      return json({ ok: false, error: 'DISPLAY_NAME_NOT_SAFE' })
    }
  }
  
  const passwordHash = await hash(body.password)
  await addAccount({
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    username: body.username,
    ...(body.displayName && { displayName: body.displayName }),
    createdAt: Date.now(),
    passwordHash,
    bots: [],
  })

  const sessionToken = nanoid()
  await addSession(body.username, sessionToken)
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  const headers = new Headers()
  headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_token', sessionToken, { httpOnly: true, expires, path: '/' }))
  headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_authorized', body.displayName ?? body.username, { httpOnly: false, expires, path: '/' }))

  return json({ ok: true }, { headers })
}