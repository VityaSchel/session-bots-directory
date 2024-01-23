import { addSession, getAccount } from '@/server/auth'
import { compare } from '@/server/hash'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { nanoid } from 'nanoid'
import { verifyCaptcha } from '@/server/captcha'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  const bodySchema = Yup.object({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/)
      .max(16)
      .required(),
    password: Yup.string()
      .max(128)
      .required(),
    captcha: Yup.string()
      .required(),
  })
  const body = await request.json() as Yup.InferType<typeof bodySchema>
  try {
    await bodySchema.validate(body)
  } catch (error) {
    return json({ ok: false }, { status: 400 })
  }

  if(!verifyCaptcha(body.captcha)) {
    return json({ ok: false, error: 'CAPTCHA_NOT_VERIFIED' }, { status: 400 })
  }

  const account = await getAccount(body.username)
  if (!account) {
    return json({ ok: false, error: 'ACCOUNT_NOT_FOUND' })
  }
  
  if (!await compare(account.passwordHash, body.password)) {
    return json({ ok: false, error: 'INVALID_PASSWORD' })
  }

  const sessionToken = nanoid()
  await addSession(body.username, sessionToken)
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  const headers = new Headers()
  headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_token', sessionToken, { httpOnly: true, expires, path: '/' }))
  headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_authorized', account.displayName ?? account.username, { httpOnly: false, expires, path: '/' }))

  return json({ ok: true }, { headers })
}