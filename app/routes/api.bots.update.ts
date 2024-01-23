import { addAccount, addSession, deleteAccount, getAccount, resolveSession } from '@/server/auth'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { nanoid } from 'nanoid'
import { hash } from '@/server/hash'
import { addBot, deleteBots, getBot, getBots, updateBot } from '@/server/bots'
import { getDb } from '@/db'
import { startVerification, verifyBot } from '@/server/verification'
import { isSafe } from '@/server/moderation'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method === 'POST') {
    const body = await request.json() as { botId: string, visibility?: 'public' | 'hidden', description?: string, name?: string }
    try {
      await Yup.object({
        botId: Yup.string()
          .length(66)
          .required(),
        visibility: Yup.string()
          .oneOf(['public', 'hidden']),
        description: Yup.string()
          .min(1)
          .max(200),
        name: Yup.string()
          .min(1)
          .max(28),
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

    const bot = await getBot(body.botId)
    if (!bot) {
      return json({ ok: false }, { status: 404 })
    }

    if (bot.author !== username) {
      return json({ ok: false }, { status: 403 })
    }

    if(body.description !== undefined) {
      await updateBot(body.botId, 'description', body.description)
    }

    if (body.name !== undefined) {
      await updateBot(body.botId, 'name', body.name)
    }

    if (body.visibility !== undefined) {
      await updateBot(body.botId, 'visible', body.visibility === 'public')
    }

    return json({ ok: true })
  } else if (request.method === 'DELETE') {
    const body = await request.json() as { botId: string }
    try {
      await Yup.object({
        botId: Yup.string()
          .length(66)
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

    const bot = await getBot(body.botId)
    if (!bot) {
      return json({ ok: false }, { status: 404 })
    }

    if(bot.author !== username) {
      return json({ ok: false }, { status: 403 })
    }

    await deleteBots([body.botId])

    return json({ ok: true })
  } else {
    return json({ ok: false }, { status: 405 })
  }
}