import React from 'react'
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import Cookie from 'cookie'
import { getAccount, resolveSession } from '@/server/auth'
// import { getBots } from '@/server/bots'
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
import { Link, Outlet } from '@remix-run/react'

export const handle = { i18n: 'dashboard' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
  ]
}

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  // const cookies = Cookie.parse(request.headers.get('Cookie') || '')
  // const sessionToken = cookies['sessionbots.directory_token']
  // const username = await resolveSession(sessionToken)
  // if (!username) {
  //   return json({ ok: false, error: 'NOT_AUTHORIZED' })
  // }

  // const account = await getAccount(username)
  // if (!account) return json({ ok: false, error: 'NO_ACCOUNT' })
  // const botsIds = account?.bots
  // const bots = await getBots(botsIds)

  return json({ bots: [] })
}

export default function ManageBotsPage() {
  const { t } = useTranslation('dashboard')
  const bots: Bot[] = [
    { id: 'asuhkdkasdgasbukdbt187236123', name: 'test', author: 'Aboba', description: 'орфырфыворфыовдофыодлвфов', createdAt: new Date('2023-01-01').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt18723612', name: 'test', author: 'Aboba', description: '', createdAt: new Date('2023-01-03').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt1872361', name: 'test', author: 'Aboba', description: 'орфыров', createdAt: new Date('2023-01-02').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt187236', name: 'test', author: 'Aboba', description: 'орфыров', createdAt: new Date('2023-01-04').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt18723', name: 'test', author: 'Aboba', description: 'фыдовофлыволдфылдоволдфывдлофдолыводлфыдолвфдлоыв', createdAt: new Date('2023-01-05').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt1872', name: 'test', author: 'Aboba', description: 'Кожанная сумка оловяные солдатникиии Кожанная сумка оловяный солдатик ', createdAt: new Date('2023-01-06').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt187', name: 'test', author: 'Aboba', description: 'Бот не даст вам соскучиться, пиши развлекайся', createdAt: new Date('2023-01-07').getTime(), status: 'online', views: 0, visible: true },
    { id: 'asuhkdkasdgasbukdbt18', name: 'test', author: 'Aboba', description: 'Анонимный чат со случайными людьми из Session. Команды: /start — то то то, то то то, то то то. Опенсорс. Репозиторий: https://github.com/vityaschel/session-random-chat-bot. Создатель: hloth.dev', createdAt: new Date('2023-01-08').getTime(), status: 'online', views: 0, visible: true },
  ]


  return (
    <div className='w-full flex flex-col gap-8 p-6 870:p-12'>
      <h1 className='text-3xl font-bold'>{t('title')}</h1>
      <div className='w-full flex flex-col-reverse 870:flex-row'>
        <div className='flex-[3] grid 1200:grid-cols-2 gap-4'>
          {bots.map(bot => (
            <BotCard bot={bot} key={bot.id} />
          ))}
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
          <Button className='870:ml-8 justify-start font-bold' variant='outline'>
            <MdEdit className='mr-2' /> {t('buttons.change_displayname')}
          </Button>
          <Button className='870:ml-8 justify-start font-bold' variant='outline'>
            <MdEdit className='mr-2' /> {t('buttons.change_password')}
          </Button>
          <Button className='870:ml-8 justify-start font-bold' variant='destructive'>
            <MdDelete className='mr-2' /> {t('buttons.delete_account')}
          </Button>
        </div>
      </div>
    </div>
  )
}

function BotCard({ bot }: {
  bot: Bot
}) {
  const { t } = useTranslation('dashboard')

  return (
    <Card className="w-full max-w-full flex flex-col h-[346px]">
      <CardHeader>
        <CardTitle>{bot.name}</CardTitle>
        <CardDescription className='break-words'>SessionID: <b>{bot.id}</b></CardDescription>
      </CardHeader>
      <CardContent className='font-[montserrat] text-muted-foreground flex-1 break-words [overflow-wrap:anywhere]'>
        {bot.description || <Button variant='ghost' className='font-bold'>{t('bots.add_description')}</Button>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Select
          value={String(bot.visible)}
          onValueChange={visibility => {
            visibility as 'true' | 'false'
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
          <Button className='font-bold' variant="secondary" size='icon'>
            {/* {t('bots.edit')} */}
            <MdEdit size={20} />
          </Button>
          <Button className='font-bold' variant={'destructive'} size='icon'>
            {/* {t('bots.delete')} */}
            <MdDelete size={20} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}