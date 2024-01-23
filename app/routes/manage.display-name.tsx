import React from 'react'
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
// import { getBots } from '@/server/bots'
import { Button } from '@/shared/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/ui/dialog'
import { Outlet, useNavigate, useNavigation, useSearchParams } from '@remix-run/react'
import { Input } from '@/shared/shadcn/ui/input'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Textarea } from '@/shared/shadcn/ui/textarea'
import { Checkbox } from '@/shared/shadcn/ui/checkbox'
import cx from 'classnames'

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

export default function ChangeDisplayNamePage() {
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
            <DialogTitle>{t('settings.display_name.title')}</DialogTitle>
            <DialogDescription className='font-[montserrat] pt-3 [overflow-wrap:anywhere]'>
              {t('settings.display_name.description')}
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{ displayName: '' }}
            validationSchema={
              Yup.object({
                displayName: Yup.string()
                  .max(36, t('form_errors.displayName_too_long')),
              })
            }
            validateOnChange
            validateOnMount
            onSubmit={async (values) => {
              setError('')
              try {
                const request = await fetch('/api/account/display-name', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    newDisplayName: values.displayName
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
                <Input name='displayName' value={values.displayName} onChange={handleChange} placeholder={t('settings.display_name.placeholder')} />
                <span className='text-red-600 font-bold text-sm mt-2'>{error}</span>
                <Button className='mt-4 font-bold' disabled={isSubmitting}>{t('settings.display_name.submit')}</Button>
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