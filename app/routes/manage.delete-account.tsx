import React from 'react'
import { MetaFunction } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
// import { getBots } from '@/server/bots'
import { Button } from '@/shared/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/shadcn/ui/dialog'
import { Outlet, useNavigate } from '@remix-run/react'

export const handle = { i18n: 'dashboard' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Dashboard' }
  ]
}

export default function DeleteAccountPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const [error, setError] = React.useState<string>('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onClose = () => {
    navigate('/manage')
  }

  const onSubmit = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      const request = await fetch('/api/profile/update', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (request.status === 200) {
        const response = await request.json() as { ok: false, error: string } | { ok: true }
        if (!response.ok) {
          setError(response.error)
        } else {
          onClose()
        }
      } else {
        setError(t('form_errors.unknown_error'))
      }
    } catch (e) {
      console.error(e)
      setError(t('form_errors.unknown_error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open onOpenChange={visible => !visible && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('settings.delete_account.title')}</DialogTitle>
            <DialogDescription className='font-[montserrat] pt-3 [overflow-wrap:anywhere]'>
              {t('settings.delete_account.description')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 items-center'>
              <span className='text-red-600 font-bold text-sm mt-2'>{error}</span>
              <DialogFooter className='mt-4 w-full !justify-between'>
                <Button className='font-bold' variant={'secondary'} disabled={isSubmitting} type='button' onClick={onClose}>{t('settings.delete_account.cancel')}</Button>
                <Button className='font-bold' variant={'default'} disabled={isSubmitting}>{t('settings.delete_account.submit')}</Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Outlet />
    </>
  )
}