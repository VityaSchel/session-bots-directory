import { getBot } from '@/server/bots'
import { verifyCaptcha } from '@/server/captcha'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method === 'POST') {
    const body = await request.json()
    try {
      await Yup.object({
        botId: Yup.string()
          .length(66),
        captcha: Yup.string(),
      }).validate(body)
    } catch (error) {
      return json({ ok: false }, { status: 400 })
    }

    if(!await verifyCaptcha(body.captcha)) {
      return json({ ok: false, error: 'CAPTCHA_NOT_VERIFIED' }, { status: 400 })
    }

    const bot = await getBot(body.botId)
    if (!bot) {
      return json({ ok: false, error: 'BOT_NOT_FOUND' }, { status: 404 })
    }

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `Report to <b>${bot.name}</b> by <b>${bot.author}</b> <pre>${body.botId}</pre>`,
        parse_mode: 'HTML'
      })
    })

    return json({ ok: true })
  } else {
    return json({ ok: false }, { status: 405 })
  }
}