import { getAccount, resolveSession } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { startVerification } from '@/server/verification'

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

  const verification = await startVerification(body.sessionID, account.id)

  return json({ ok: true, verification: { input: verification.verificationInput, output: verification.verificationOutput } })
}