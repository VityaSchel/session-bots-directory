import { getAccount } from '@/server/auth'
import { compare } from '@/server/hash'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  const body = await request.json() as { username: string, password: string }
  try {
    await Yup.object({
      username: Yup.string()
        .matches(/^[a-zA-Z0-9_]+$/)
        .max(16)
        .required(),
      password: Yup.string()
        .max(128)
        .required(),
    }).validate(body)
  } catch (error) {
    return json({ ok: false }, { status: 400 })
  }

  const account = await getAccount(body.username)
  if (!account) {
    return json({ ok: false, error: 'ACCOUNT_NOT_FOUND' })
  }
  
  if (!await compare(account.passwordHash, body.password)) {
    return json({ ok: false, error: 'INVALID_PASSWORD' })
  }
}