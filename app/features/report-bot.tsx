import React from 'react'
import { CaptchaDialog } from '@/features/captcha-dialog'
import { Bot } from '@/shared/model/bot'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/shadcn/ui/alert-dialog'
import { Button } from '@/shared/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { RiFlag2Fill } from 'react-icons/ri'
import { toast } from 'sonner'

export function ReportBot({ bot, onReported }: {
  bot: Bot
  onReported: () => void
}) {
  const { t } = useTranslation('search')
  const [captchaVisible, setCaptchaVisible] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  const handleReport = async (captcha: string) => {
    setCaptchaVisible(false)
    setVisible(false)
    try {
      const request = await fetch('/api/report', {
        method: 'POST',
        body: JSON.stringify({
          botId: bot.id,
          captcha
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if(request.status !== 200) {
        toast.error(t('report.error'))
      } else {
        const response = await request.json() as { ok: true } | { ok: false, error: string }
        if(!response.ok) {
          console.error(response.error)
          toast.error(t('report.error'))
        } else {
          onReported()
          toast.success(t('report.success'))
        }
      }
    } catch(e) {
      console.error(e)
      toast.error(t('report.error'))
    }
  }

  return (
    <AlertDialog open={visible}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size='icon' onClick={() => setVisible(true)}>
          <RiFlag2Fill />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('report.title.0')} <span className='bg-muted py-1 px-2 rounded-sm'>{bot.name}</span> {t('report.title.1')}</AlertDialogTitle>
          <AlertDialogDescription className='font-[montserrat]'>
            {t('report.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='font-bold' onClick={() => setVisible(false)}>{t('report.cancel')}</AlertDialogCancel>
          <Button className='font-bold' onClick={() => setCaptchaVisible(true)}>{t('report.submit')}</Button>
          <CaptchaDialog 
            visible={captchaVisible} 
            onCancel={() => setCaptchaVisible(false)}
            onSolve={handleReport}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
