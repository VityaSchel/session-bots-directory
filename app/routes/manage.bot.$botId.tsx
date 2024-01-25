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
import { Outlet, useLoaderData, useNavigate, useNavigation, useParams, useRevalidator, useSearchParams } from '@remix-run/react'
import { Input } from '@/shared/shadcn/ui/input'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Textarea } from '@/shared/shadcn/ui/textarea'
import cookie from 'cookie'
import { resolveSession } from '@/server/auth'
import { getBot } from '@/server/bots'
import { toast } from 'sonner'

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
  params: { botId },
}: LoaderFunctionArgs) => {
  const cookies = cookie.parse(request.headers.get('Cookie') || '')
  const sessionToken = cookies['sessionbots.directory_token']
  if (!sessionToken || !botId) {
    return json({ name: '', description: '' })
  }
  const username = await resolveSession(sessionToken)
  if (!username) {
    return json({ name: '', description: '' })
  }

  const bot = await getBot(botId)
  if (!bot || bot.author !== username) {
    return json({ name: '', description: '' })
  }

  return json({ name: bot.name, description: bot.description })
}

export default function EditBotPage() {
  const { t } = useTranslation('dashboard')
  const { name, description } = useLoaderData<typeof loader>()
  const { botId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = React.useState<string>('')
  const revalidator = useRevalidator()

  const onClose = () => {
    navigate('/manage')
    revalidator.revalidate()
  }
  
  return (
    <>
      <Dialog open onOpenChange={visible => !visible && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('settings.edit_bot.title')}</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{ name, description }}
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
                const request = await fetch('/api/bots/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    botId: botId,
                    name: values.name,
                    description: values.description
                  })
                })
                if (request.status === 200) {
                  const response = await request.json() as { ok: false, error: string } | { ok: true }
                  if (!response.ok) {
                    if (response.error === 'DISPLAY_NAME_NOT_SAFE') {
                      setError(t('form_errors.display_name_not_safe'))
                    } else {
                      setError(response.error)
                    }
                  } else {
                    toast.success(t('bots.update_success'))
                    onClose()
                  }
                } else {
                  setError(t('form_errors.unknown_error'))
                }
              } catch (e) {
                console.error(e)
                setError(t('form_errors.unknown_error'))
              }
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting
            }) => (
              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2 items-center'>
                  <Input
                    name='name'
                    value={values.name}
                    onChange={handleChange}
                    placeholder={t('add.fields.name')}
                    maxLength={36}
                  />
                  <Textarea 
                    name='description'
                    value={values.description}
                    onChange={handleChange}
                    placeholder={t('add.fields.description')}
                    rows={5}
                    className='font-[montserrat] resize-none'
                  />
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