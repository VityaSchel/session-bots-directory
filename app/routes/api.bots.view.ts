import { getBot, updateBot } from '@/server/bots'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import * as Yup from 'yup'

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method === 'POST') {
    const bodySchema = Yup.object({
      id: Yup.string()
        .matches(/^[a-f0-9]{66}$/)
        .required(),
    })
    const body = await request.json() as Yup.InferType<typeof bodySchema>
    try {
      await bodySchema.validate(body)
    } catch (error) {
      return json({ ok: false }, { status: 400 })
    }

    const bot = await getBot(body.id)

    if(!bot) {
      return json({ ok: false }, { status: 404 })
    }

    await updateBot(body.id, 'views', bot.views + 1)
    return json({ ok: true })
  }
}