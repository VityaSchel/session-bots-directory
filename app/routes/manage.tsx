import React from 'react'
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import Cookie from 'cookie'
import { getAccount, resolveSession } from '@/server/auth'
import { getBots } from '@/server/bots'
import { Button } from '@/shared/shadcn/ui/button'
import { BsPlusCircle } from 'react-icons/bs'
import { MdEdit, MdDelete } from 'react-icons/md'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/ui/card'
import { Bot } from '@/shared/model/bot'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/ui/select'
import { Link, Outlet, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { toast } from 'sonner'
import { Textarea } from '@/shared/shadcn/ui/textarea'
import { BotFullDescription } from '@/entities/bot-full-description'
import { OnlineOfflineIndicator } from '@/entities/online-offline-indicator'

export const handle = { i18n: 'dashboard' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Dashboard' }
  ]
}

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const cookies = Cookie.parse(request.headers.get('Cookie') || '')
  const sessionToken = cookies['sessionbots.directory_token']
  if (!sessionToken) {
    return json({ ok: false, error: 'NOT_AUTHORIZED' })
  }
  const username = await resolveSession(sessionToken)
  if (!username) {
    return json({ ok: false, error: 'NOT_AUTHORIZED' })
  }

  const account = await getAccount(username)
  if (!account) return json({ ok: false, error: 'NO_ACCOUNT' })
  const botsIds = account?.bots
  const bots = await getBots(botsIds)

  return json({ ok: true, bots })
}

export default function ManageBotsPage() {
  const { t } = useTranslation('dashboard')
  const data = useLoaderData<typeof loader>()

  if(data.ok === false) {
    if ('error' in data && ['NOT_AUTHORIZED','NO_ACCOUNT'].includes(data.error)) {
      return (
        <div className='p-6 870:p-12 text-3xl font-bold' style={{
          minHeight: 'calc(100vh - 193px)'
        }}>{t('not_authorized')}</div>
      )
    } else {
      throw new Error('Unknown error')
    }
  }

  const bots = (data as { ok: true, bots: Bot[] }).bots

  return (
    <div 
      className='w-full flex flex-col gap-8 p-6 870:p-12'
      style={{
        minHeight: 'calc(100vh - 193px)'
      }}
    >
      <h1 className='text-3xl font-bold'>{t('title')}</h1>
      <div className='w-full flex flex-col-reverse 870:flex-row flex-1'>
        <div className='flex-[3] grid 1200:grid-cols-2 gap-4'>
          {bots.length ? bots.map(bot => (
            <BotCard bot={bot} key={bot.id} />
          )) : (
            <span className='text-muted-foreground'>{t('no_bots')}</span>
          )}
        </div>
        <span className='border border-dashed border-brand my-8 870:my-0 870:ml-8'></span>
        <div className='flex-1 flex flex-col gap-2 870:py-8'>
          <Link to='/manage/add' className='870:ml-8'>
            <Button className='w-full justify-start font-bold' variant='secondary'>
              <BsPlusCircle className='mr-2' /> {t('buttons.add')}
            </Button>
          </Link>
          <Outlet />
          <span className='border border-dashed border-brand w-full my-8'></span>
          <Link to='/manage/display-name' className='870:ml-8'>
            <Button className='w-full justify-start font-bold' variant='outline'>
              <MdEdit className='mr-2' /> {t('buttons.change_displayname')}
            </Button>
          </Link>
          <Link to='/manage/password' className='870:ml-8'>
            <Button className='w-full justify-start font-bold' variant='outline'>
              <MdEdit className='mr-2' /> {t('buttons.change_password')}
            </Button>
          </Link>
          <Link to='/manage/delete-account' className='870:ml-8'>
            <Button className='w-full justify-start font-bold' variant='destructive'>
              <MdDelete className='mr-2' /> {t('buttons.delete_account')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function BotCard({ bot }: {
  bot: Bot
}) {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const [isAddingDescription, setIsAddingDescription] = React.useState(false)
  const [freshlyAddedDescriptionValue, setFreshlyAddedDescriptionValue] = React.useState('')
  const [openFullDescription, setOpenFullDescription] = React.useState(false)

  const handleDeleteBot = async () => {
    const request = await fetch('/api/bots/update', {
      method: 'DELETE',
      body: JSON.stringify({
        botId: bot.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request.json() as { ok: true } | { ok: false, error: string }
    if(response.ok) {
      toast.success(t('bots.delete_success'))
      navigate('/manage', { replace: true })
      revalidator.revalidate()
    } else {
      toast.error(t('bots.delete_error'))
    }
  }

  const handleStartAddingDescription = () => {
    setIsAddingDescription(true)
  }

  const handleFinishAddingDescription = async () => {
    if(freshlyAddedDescriptionValue === (bot.description ?? '')) return
    setIsAddingDescription(false)
    const request = await fetch('/api/bots/update', {
      method: 'POST',
      body: JSON.stringify({
        botId: bot.id,
        description: freshlyAddedDescriptionValue
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request.json() as { ok: true } | { ok: false, error: string }
    if(response.ok) {
      toast.success(t('bots.update_success'))
      navigate('/manage', { replace: true })
      revalidator.revalidate()
    } else {
      toast.error(t('bots.update_error'))
    }
  }

  return (
    <Card className="w-full max-w-full flex flex-col h-[380px]">
      <CardHeader>
        <CardTitle className='[overflow-wrap:anywhere]'>
          {bot.name}
          <OnlineOfflineIndicator 
            online={bot.status == 'online'} 
            offlineFails={bot.checksFails}
          />
        </CardTitle>
        <CardDescription className='[overflow-wrap:anywhere]'>SessionID: <b>{bot.id}</b></CardDescription>
      </CardHeader>
      <CardContent className='font-[montserrat] text-muted-foreground flex-1 [overflow-wrap:anywhere] whitespace-pre-wrap [display: -webkit-box] overflow-hidden text-ellipsis line-clamp-[10] relative'>
        {isAddingDescription ? (
          <Textarea 
            value={freshlyAddedDescriptionValue} 
            onChange={e => setFreshlyAddedDescriptionValue(e.target.value)}
            onBlur={handleFinishAddingDescription}
            placeholder={t('add.fields.description')}
            className='resize-none mt-[1px]'
            style={{ height: 'calc(100% - 16px)' }}
            maxLength={200}
          />
        ) : (
          bot.description ? (
            <>
              <button 
                className='font-[inherit] bg-transparent w-full h-full overflow-hidden text-left flex'
                onClick={() => setOpenFullDescription(true)}
              >
                {bot.description}
              </button> 
              <BotFullDescription
                description={bot.description}
                visible={openFullDescription}
                onClose={() => setOpenFullDescription(false)} 
              />
            </>
          ) : <Button variant='ghost' className='font-bold' onClick={handleStartAddingDescription}>
            {t('bots.add_description')}
          </Button>
        )}
        <div
          className='absolute bottom-6 h-8 bg-gradient-to-b from-transparent to-card pointer-events-none'
          style={{ width: 'calc(100% - 3rem)' }}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Select
          value={String(bot.visible)}
          onValueChange={async visibility => {
            const request = await fetch('/api/bots/update', {
              method: 'POST',
              body: JSON.stringify({
                botId: bot.id,
                visibility: (visibility as 'true' | 'false') === 'true' ? 'public' : 'hidden'
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            const response = await request.json() as { ok: true } | { ok: false, error: string }
            if(!response.ok) {
              toast.error(t('bots.update_error'))
            } else {
              toast.success(t('bots.update_success'))
              navigate('/manage', { replace: true })
              revalidator.revalidate()
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('bots.visibility.public')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'true'}>{t('bots.visibility.public')}</SelectItem>
              <SelectItem value={'false'}>{t('bots.visibility.hidden')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className='flex gap-2'>
          <Link to={`/manage/bot/${bot.id}`}>
            <Button className='font-bold' variant="secondary" size='icon'>
              {/* {t('bots.edit')} */}
              <MdEdit size={20} />
            </Button>
          </Link>
          <Button className='font-bold' variant={'destructive'} size='icon' onClick={handleDeleteBot}>
            {/* {t('bots.delete')} */}
            <MdDelete size={20} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}