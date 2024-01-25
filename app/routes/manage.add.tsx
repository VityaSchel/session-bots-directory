import React from 'react'
import { MetaFunction } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/shadcn/ui/dialog'
import { Outlet, useNavigate, useSearchParams } from '@remix-run/react'
import { Input } from '@/shared/shadcn/ui/input'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Textarea } from '@/shared/shadcn/ui/textarea'
import { Checkbox } from '@/shared/shadcn/ui/checkbox'
import cx from 'classnames'
import { CaptchaDialog } from '@/features/captcha-dialog'

export const handle = { i18n: 'dashboard' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Dashboard' }
  ]
}

export default function AddNewBotStartPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [error, setError] = React.useState<string>('')
  const [stage, setStage] = React.useState<'initial' | 'verification'>('initial')
  const [verificationData, setVerificationData] = React.useState({ input: '', output: '' })
  const [captchaVisible, setCaptchaVisible] = React.useState(false)
  const [invalidResponse, setInvalidResponse] = React.useState('')

  const onClose = () => {
    navigate('/manage')
  }

  return (
    <>
      <Dialog open onOpenChange={visible => !visible && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('add.title')}</DialogTitle>
            <DialogDescription className='font-[montserrat] pt-3 [overflow-wrap:anywhere]'>
              {stage === 'initial' ? t('add.step1.description') : t('add.step2.description')}
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
              captcha: ''
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
              setError('')
              setInvalidResponse('')
              try {
                if(stage === 'initial') {
                  const request = await fetch('/api/bots/verification', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      sessionID: values.sessionID,
                    })
                  })
                  if (request.status === 200) {
                    const response = await request.json() as { ok: false, error: string } | { ok: true, verification: { input: string, output: string } }
                    if (!response.ok) {
                      setError(response.error)
                    } else {
                      setStage('verification')
                      setVerificationData(response.verification)
                    }
                  } else {
                    setError(t('form_errors.unknown_error'))
                  }
                } else {
                  const request = await fetch('/api/bots/add', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      sessionID: values.sessionID,
                      name: values.name,
                      ...(values.description && { description: values.description }),
                      captcha: values.captcha
                    })
                  })
                  if (request.status === 200) {
                    const response = await request.json() as { ok: false, error: string } 
                      | { ok: false, error: 'INVALID_VERIFICATION', output: string }
                      | { ok: true }
                    if (!response.ok) {
                      switch(response.error) {
                        case 'INVALID_VERIFICATION':
                          setError(t('form_errors.invalid_verification'))
                          break
                        case 'INTERNAL_SERVER_ERROR':
                          setError(t('form_errors.unknown_error'))
                          break
                        default:
                          setError(response.error)
                          break
                      }
                      
                      if ('output' in response/*response.error === 'INVALID_VERIFICATION'*/) {
                        setInvalidResponse(response.output)
                      }
                    } else {
                      navigate('/manage')
                      onClose()
                    }
                  } else {
                    setError(t('form_errors.unknown_error'))
                  }
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
            }) => {
              return (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                  {stage === 'initial' ? (<>
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
                        disabled={isSubmitting}
                      />
                      <Input 
                        name='name'
                        value={values.name}
                        type='text'
                        placeholder={t('add.fields.name')}
                        onChange={handleChange}
                        maxLength={28}
                        disabled={isSubmitting}
                      />
                      <Textarea 
                        name='description'
                        value={values.description}
                        placeholder={t('add.fields.description')}
                        onChange={handleChange}
                        rows={5}
                        maxLength={200}
                        className='font-[montserrat] resize-none'
                        disabled={isSubmitting}
                      />
                      <span className={cx('self-end text-xs text-muted-foreground font-mono tabular-nums transition-opacity', { 
                        'opacity-1': values.description.length > 0,
                        'opacity-0': values.description.length === 0,
                      })}>{values.description.length}/200</span>
                      <div className='mt-2 flex flex-col gap-2'>
                        <Check 
                          checked={values.checkbox1} 
                          setFieldValue={setFieldValue} 
                          name='checkbox1' 
                          disabled={isSubmitting}
                        />
                        <Check 
                          checked={values.checkbox2} 
                          setFieldValue={setFieldValue} 
                          name='checkbox2' 
                          disabled={isSubmitting}
                        />
                        <Check 
                          checked={values.checkbox3} 
                          setFieldValue={setFieldValue} 
                          name='checkbox3' 
                          disabled={isSubmitting}
                        />
                        <Check 
                          checked={values.checkbox4} 
                          setFieldValue={setFieldValue} 
                          name='checkbox4' 
                          disabled={isSubmitting}
                        />
                        <Check 
                          checked={values.checkbox5} 
                          setFieldValue={setFieldValue} 
                          name='checkbox5' 
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <div className='w-full flex items-center justify-between'>
                        <span className='text-red-600 font-bold text-xs'>{error}</span>
                        <Button
                          type='submit'
                          disabled={Object.values(errors).filter(Boolean).length > 0 || isSubmitting}
                          className='font-bold'
                        >
                          {t('add.step1.submit')}
                        </Button>
                      </div>
                    </DialogFooter>
                  </>) : (<>
                    <div className='flex flex-col gap-2 items-center'>
                      <DialogDescription>{t('add.step2.text1')}:</DialogDescription>
                      <div className='font-mono [overflow-wrap:anywhere] p-3 rounded-md bg-neutral-800'>{verificationData.input}</div>
                      <DialogDescription>{t('add.step2.text2')}:</DialogDescription>
                      <div className='font-mono [overflow-wrap:anywhere] p-3 rounded-md bg-neutral-800'>{verificationData.output}</div>
                      <DialogDescription>{t('add.step2.text3')}</DialogDescription>
                      <span className='text-red-600 font-bold text-sm mt-2'>{error}</span>
                      {invalidResponse && (<>
                        <div className='mt-2 flex flex-col gap-1'>
                          <span>{t('add.step2.invalid_response')}</span>
                          <div className='p-3 rounded-md bg-neutral-800 font-mono [overflow-wrap:anywhere]'>{invalidResponse}</div>
                        </div>
                      </>)}
                      <Button 
                        type='button'
                        className='mt-4 font-bold' 
                        disabled={isSubmitting}
                        onClick={() => setCaptchaVisible(true)}
                        >{isSubmitting ? t('add.step2.is_loading') : t('add.step2.submit')}</Button>
                      <CaptchaDialog
                        visible={captchaVisible}
                        onCancel={() => setCaptchaVisible(false)}
                        onSolve={async captcha => {
                          setCaptchaVisible(false)
                          setFieldValue('captcha', captcha)
                          await new Promise(resolve => setTimeout(resolve, 10))
                          handleSubmit()
                        }}
                      />
                    </div>
                  </>)}
                </form>
              )
            }}
          </Formik>
        </DialogContent>
      </Dialog>
      <Outlet />
    </>
  )
}


function Check({ checked, setFieldValue, name, disabled }: {
  checked: boolean
  setFieldValue: (name: string, value: string | boolean) => void
  name: string
  disabled?: boolean
}) {
  const { t } = useTranslation('dashboard')

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={s => setFieldValue(name, s)}
        disabled={disabled}
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