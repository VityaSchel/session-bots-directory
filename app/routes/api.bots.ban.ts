import { LoaderFunctionArgs, json } from '@remix-run/node'
import cookie from 'cookie'
import { deleteBots } from '@/server/bots'

export async function loader({ request }: LoaderFunctionArgs) {
  if(request.method !== 'GET') {
    return json({ ok: false }, { status: 405 })
  }

  const cookies = cookie.parse(request.headers.get('Cookie') || '')
  const adminToken = cookies['sessionbotsdirectory_admin_token']
  if (!process.env.ADMIN_TOKEN || !adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return json({ ok: false }, { status: 401 })
  }
  
  const botId = new URL(request.url).searchParams.get('botId')
  if (!botId) {
    return json({ ok: false }, { status: 400 })
  }

  await deleteBots([botId])

  return json({ ok: true })
}