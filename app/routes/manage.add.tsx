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

export default function AddNewBotStartPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  
  const onClose = () => {
    navigate('/manage')
  }

  const onSubmit = () => {
    
  }

  return (
    <>
      <Dialog open onOpenChange={visible => !visible && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('add.title')}</DialogTitle>
            <DialogDescription className='font-[montserrat] pt-3'>
              {t('add.step1.description')}
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{ 
              sessionID: params.get('sessionid') || '', 
              name: '', 
              description: '',
              checkbox1: false,
              checkbox2: false,
              checkbox3: false,
              checkbox4: false,
              checkbox5: false,
            }}
            validationSchema={
              Yup.object({
                sessionID: Yup.string() 
                  .matches(/^[a-f0-9]{66}$/, t('add.form_errors.invalid_session_id'))
                  .required(t('add.form_errors.required')),
                name: Yup.string()
                  .max(28, t('add.form_errors.name_too_long'))
                  .required(t('add.form_errors.required')),
                description: Yup.string()
                  .max(200, t('add.form_errors.description_too_long')),
                checkbox1: Yup.boolean().oneOf([true]),
                checkbox2: Yup.boolean().oneOf([true]),
                checkbox3: Yup.boolean().oneOf([true]),
                checkbox4: Yup.boolean().oneOf([true]),
                checkbox5: Yup.boolean().oneOf([true]),
              })
            }
            validateOnChange
            validateOnMount
            onSubmit={async (values) => {
              const request = await fetch('/api/bots', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              })
              // if (request.status === 200) {
              //   const response = await request.json() as { ok: false, error: 'ACCOUNT_NOT_FOUND' | 'INVALID_PASSWORD' } | { ok: true }
              //   if (!response.ok) {
              //     if (response.error === 'ACCOUNT_NOT_FOUND') {
              //       setError(t('form_errors.account_not_found'))
              //     } else if (response.error === 'INVALID_PASSWORD') {
              //       setError(t('form_errors.invalid_password'))
              //     } else {
              //       setError(t('form_errors.unknown_error'))
              //     }
              //   } else {
              //     onClose()
              //   }
              // } else {
              //   setError(t('form_errors.unknown_error'))
              // }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => (
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Input 
                  name='sessionID'
                  value={values.sessionID}
                  type='text'
                  placeholder='Session ID'
                  onChange={handleChange}
                  maxLength={66}
                  className={errors.sessionID && (values.sessionID !== '') ? 'border-red-600' : ''}
                  title={errors.sessionID && (values.sessionID !== '') ? errors.sessionID : ''}
                />
                <Input 
                  name='name'
                  value={values.name}
                  type='text'
                  placeholder={t('add.fields.name')}
                  onChange={handleChange}
                  maxLength={28}
                />
                <Textarea 
                  name='description'
                  value={values.description}
                  placeholder={t('add.fields.description')}
                  onChange={handleChange}
                  rows={5}
                  maxLength={200}
                  className='font-[montserrat] resize-none'
                />
                <span className={cx('self-end text-xs text-muted-foreground font-mono tabular-nums transition-opacity', { 
                  'opacity-1': values.description.length > 0,
                  'opacity-0': values.description.length === 0,
                })}>{values.description.length}/200</span>
                <div className='mt-2 flex flex-col gap-2'>
                  <Check checked={values.checkbox1} setFieldValue={setFieldValue} name='checkbox1' />
                  <Check checked={values.checkbox2} setFieldValue={setFieldValue} name='checkbox2' />
                  <Check checked={values.checkbox3} setFieldValue={setFieldValue} name='checkbox3' />
                  <Check checked={values.checkbox4} setFieldValue={setFieldValue} name='checkbox4' />
                  <Check checked={values.checkbox5} setFieldValue={setFieldValue} name='checkbox5' />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={onSubmit}
                  disabled={Object.values(errors).filter(Boolean).length > 0}
                >
                  {t('add.step1.submit')}
                </Button>
              </DialogFooter>
            </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Outlet />
    </>
  )
}


function Check({ checked, setFieldValue, name }: {
  checked: boolean
  setFieldValue: (name: string, value: string | boolean) => void
  name: string
}) {
  const { t } = useTranslation('dashboard')

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={s => setFieldValue(name, s)}
      />
      <label
        htmlFor={name}
        className="cursor-pointer text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[montserrat]"
      >
        {t('add.fields.' + name)}
      </label>
    </div>
  )
}