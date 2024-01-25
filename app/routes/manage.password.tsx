import React from 'react'
import { MetaFunction } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
// import { getBots } from '@/server/bots'
import { Button } from '@/shared/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/ui/dialog'
import { Outlet, useNavigate } from '@remix-run/react'
import { Input } from '@/shared/shadcn/ui/input'
import { Formik } from 'formik'
import * as Yup from 'yup'

export const handle = { i18n: 'dashboard' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Dashboard' }
  ]
}

export default function ChangePasswordPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const [error, setError] = React.useState<string>('')

  const onClose = () => {
    navigate('/manage')
  }

  return (
    <>
      <Dialog open onOpenChange={visible => !visible && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('settings.password.title')}</DialogTitle>
            <DialogDescription className='font-[montserrat] pt-3 [overflow-wrap:anywhere]'>
              {t('settings.password.description')}
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{ password: '' }}
            validationSchema={
              Yup.object({
                password: Yup.string()
                  .max(128, t('form_errors.password_too_long')),
              })
            }
            validateOnChange
            validateOnMount
            onSubmit={async (values) => {
              setError('')
              try {
                const request = await fetch('/api/profile/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    newPassword: values.password
                  })
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
              } catch(e) {
                console.error(e)
                setError(t('form_errors.unknown_error'))
              }
            }}
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => (
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2 items-center'>
                <Input
                  name='password'
                  type='password'
                  autoComplete='off'
                  value={values.password}
                  onChange={handleChange}
                  placeholder={t('settings.password.placeholder')} 
                  maxLength={128}
                />
                <span className='text-red-600 font-bold text-sm mt-2'>{error}</span>
                <Button className='mt-4 font-bold' disabled={isSubmitting}>{t('settings.password.submit')}</Button>
              </div>
            </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Outlet />
    </>
  )
}