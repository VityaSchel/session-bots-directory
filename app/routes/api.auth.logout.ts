import { addSession, deleteSession, getAccount, resolveSession } from '@/server/auth'
import { compare } from '@/server/hash'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import * as Yup from 'yup'
import cookie from 'cookie'
import { nanoid } from 'nanoid'

export async function loader({
  params,
  request
}: LoaderFunctionArgs) {
  return json({ ok: false })
}

export async function action({ request }: LoaderFunctionArgs) {
  const cookies = cookie.parse(request.headers.get('Cookie') || '')
  const sessionToken = cookies['sessionbots.directory_token']
  const username = sessionToken && await resolveSession(sessionToken)
  if (username) {
    await deleteSession(sessionToken)
  }

  const headers = new Headers()
  headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_token', '', { httpOnly: true, expires: new Date(0), path: '/' }))
  headers.append('Set-Cookie', cookie.serialize('sessionbots.directory_authorized', '', { httpOnly: true, expires: new Date(0), path: '/' }))

  return json({ ok: true }, { headers })
}