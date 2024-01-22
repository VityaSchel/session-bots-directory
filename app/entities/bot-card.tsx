import React from 'react'
import { Bot } from '@/model/bot'
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
import { RiFlag2Fill } from 'react-icons/ri'
import { useLocale } from 'remix-i18next'

export const handle = { i18n: 'search' }

export function BotCard({ bot }: {
  bot: Bot
}) {
  const { t } = useTranslation('search')
  const [copied, setCopied] = React.useState(false)
  const locale = useLocale()

  const handleCopy = () => {
    copy(bot.id)
    setCopied(true)
  }

  return (
    <Card className="w-full">
      <CardHeader className='flex flex-col flex-1 h-60 pb-0'>
        <CardTitle>{bot.name}</CardTitle>
        <span>{t('author')}: <b>{bot.author}</b></span>
        <CardDescription className='font-[montserrat] flex-1 break-words'>
          {bot.description || <span className='text-neutral-700'>{t('no_description')}</span>}
        </CardDescription>
        <CardDescription className='font-[montserrat]'>
          {t('createdAt')} <b>{Intl.DateTimeFormat(locale, {
            'day': '2-digit',
            'month': '2-digit',
            'year': 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(bot.createdAt)}</b>
        </CardDescription>
      </CardHeader>
      <CardContent>
        
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
        <Button variant={'destructive'} size='icon'>
          <RiFlag2Fill />
        </Button>
      </CardFooter>
    </Card>
  )
}