import React from 'react'
import { Bot } from '@/shared/model/bot'
import { Button } from '@/shared/shadcn/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/ui/card'
import { MdOutlineContentCopy, MdOutlineDone } from 'react-icons/md'
import copy from 'copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { useLocale } from 'remix-i18next'
import { ReportBot } from '@/features/report-bot'
import { Skeleton } from '@/shared/shadcn/ui/skeleton'

export const handle = { i18n: 'search' }

export function BotCard({ bot }: {
  bot: Bot
}) {
  const { t } = useTranslation('search')
  const [copied, setCopied] = React.useState(false)
  const locale = useLocale()
  const [reported, setReported] = React.useState(false)

  const handleCopy = () => {
    copy(bot.id)
    setCopied(true)
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
        <CardTitle>{bot.name}</CardTitle>
        <span>{t('author')}: <b>{bot.author}</b></span>
        <CardDescription className='font-[montserrat] flex-1 break-words whitespace-pre-wrap [display: -webkit-box] overflow-hidden text-ellipsis line-clamp-[10]'>
          {bot.description || <span className='text-neutral-700'>{t('no_description')}</span>}
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
        <Button variant='outline' onMouseDown={handleCopy} onMouseOut={() => setCopied(false)}>
          <span className='mr-2'>
            {copied 
              ? <MdOutlineDone />
              : <MdOutlineContentCopy />}
          </span>
          {bot.id.slice(0, 4) + '...' + bot.id.slice(-4)}
        </Button>
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
    <Skeleton className="w-full h-[404px] rounded-xl" />
  )
}