import React from 'react'
import { Bot } from '@/shared/model/bot'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { useLocale } from 'remix-i18next'
import { ReportBot } from '@/features/report-bot'
import { Skeleton } from '@/shared/shadcn/ui/skeleton'
import { BotFullDescription } from '@/entities/bot-full-description'
import { OnlineOfflineIndicator } from '@/entities/online-offline-indicator'
import { CopyButton } from '@/shared/ui/copy-button'

export const handle = { i18n: 'search' }

export function BotCard({ bot }: {
  bot: Bot
}) {
  const { t } = useTranslation('search')
  const locale = useLocale()
  const [reported, setReported] = React.useState(false)
  const [openFullDescription, setOpenFullDescription] = React.useState(false)

  const incrementViews = async () => {
    window.localStorage.setItem('lastCopied' + bot.id, String(Date.now()))
    // fair use pls and no spam ok?
    await fetch('/api/bots/view', {
      method: 'POST',
      body: JSON.stringify({ id: bot.id }),
    })
  }

  const onCopy = async () => {
    const lastCopied = window.localStorage.getItem('lastCopied' + bot.id)
    if(lastCopied === null) {
      incrementViews()
    } else {
      if (lastCopied && Number.isSafeInteger(lastCopied)) {
        if(Date.now() - Number(lastCopied) > 1000 * 60 * 60 * 24) {
          incrementViews()
        }
      }
    }
  }

  if (reported) {
    return (
      <Card className="w-[305px] flex justify-center items-center h-[404px]">
        <span className='text-sm text-muted-foreground font-[montserrat]'>
          {t('reported')}
        </span>
      </Card>
    )
  }

  return (
    <Card className="w-[305px]">
      <CardHeader className='flex flex-col flex-1 h-[298px] pb-0'>
        <CardTitle>
          {bot.name} 
          <OnlineOfflineIndicator 
            online={bot.status == 'online'} 
            offlineFails={bot.checksFails}
          />
        </CardTitle>
        <span>{t('author')}: <b>{bot.author}</b></span>
        <CardDescription className='font-[montserrat] flex-1 break-words whitespace-pre-wrap [display: -webkit-box] overflow-hidden text-ellipsis line-clamp-[10]'>
          {bot.description ? (<>
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
          </>) : (
            <span className='text-neutral-700'>{t('no_description')}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='text-sm text-muted-foreground font-[montserrat]'>
        {t('createdAt')} <b>{Intl.DateTimeFormat(locale, {
          'day': '2-digit',
          'month': '2-digit',
          'year': 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(bot.createdAt)}</b>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CopyButton
          content={bot.id}
          onCopied={onCopy}
        >
          {bot.id.slice(0, 4) + '...' + bot.id.slice(-4)}
        </CopyButton>
        <ReportBot 
          bot={bot} 
          onReported={() => setReported(true)} 
        />
      </CardFooter>
    </Card>
  )
}

export function BotCardSkeleton() {
  return (
    <Skeleton className="w-[305px] h-[404px] rounded-xl" />
  )
}