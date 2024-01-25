import { getAccount, resolveSession } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { addBot } from '@/server/bots'
import { verifyBot, getVerification } from '@/server/verification'
import { verifyCaptcha } from '@/server/captcha'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  const bodySchema = Yup.object({
    sessionID: Yup.string()
      .matches(/^[a-f0-9]{66}$/)
      .required(),
    name: Yup.string()
      .max(28)
      .required(),
    description: Yup.string()
      .min(1)
      .max(200),
    captcha: Yup.string()
      .required()
  })
  const body = await request.json() as Yup.InferType<typeof bodySchema>
  try {
    await bodySchema.validate(body)
  } catch (error) {
    return json({ ok: false }, { status: 400 })
  }

  if(!await verifyCaptcha(body.captcha)) {
    return json({ ok: false, error: 'CAPTCHA_NOT_VERIFIED' })
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

  try {
    const verificationResponse = await verifyBot(body.sessionID)
    if (!verificationResponse.isVerified) {
      return json({ ok: false, error: 'INVALID_VERIFICATION', output: verificationResponse.output })
    }
  } catch(e) {
    return json({ ok: false, error: 'INTERNAL_SERVER_ERROR' })
  }

  await addBot({
    id: body.sessionID,
    name: body.name,
    description: body.description || '',
    author: account.username,
    createdAt: Date.now(),
    views: 0,
    status: 'online',
    visible: true,
    checksFails: 0,
    lastChecked: Date.now(),
  })

  return json({ ok: true })
}