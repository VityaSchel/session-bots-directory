import React from 'react'
import { Button } from '@/shared/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/ui/dialog'
import { Input } from '@/shared/shadcn/ui/input'
import { Label } from '@/shared/shadcn/ui/label'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Cookies from 'js-cookie'
import { Link, useNavigate, useRevalidator, useSearchParams } from '@remix-run/react'
import { CaptchaDialog } from '@/features/captcha-dialog'

export function Auth() {
  const { t } = useTranslation('navbar')
  const [loginDialogVisible, setLoginDialogVisible] = React.useState(false)
  const [signupDialogVisible, setSignupDialogVisible] = React.useState(false)
  const [logoutDialogVisible, setLogoutDialogVisible] = React.useState(false)
  const [isAuthorized, setIsAuthorized] = React.useState<false | string>(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const getIsAuthorized = (initial = false) => {
    const isAuthorized = Cookies.get('sessionbots.directory_authorized')
    setIsAuthorized(isAuthorized ?? false)
    if (!initial && isAuthorized && params.has('signup_botid')) {
      navigate(`/manage/add?sessionid=${params.get('signup_botid')}`)
    }
  }

  React.useEffect(() => getIsAuthorized(true), [])

  React.useEffect(() => {
    if (params.has('signup_botid')) {
      setSignupDialogVisible(true)
    }
  }, [params])

  return (
    <div className='flex items-center gap-2 font-normal 510:gap-4'>
      {isAuthorized ? (<>
        <Button variant={'outline'} className='text-sm 510:text-base font-bold' onClick={() => setLogoutDialogVisible(true)}>
          <span className='hidden 1200:block'>{t('auth.logout')}</span>
          <span className='block 1200:hidden'>{t(['auth.logout_short', 'auth.logout'])}</span>
        </Button>
        <LogoutDialog
          visible={logoutDialogVisible}
          onClose={() => {
            setLogoutDialogVisible(false)
            getIsAuthorized()
          }}
        />
        <Link to='/manage'>
          <Button className='text-sm 510:text-base font-bold'>
            <span className='hidden 1200:block'>{t('manage.title')}</span>
            <span className='block 1200:hidden'>{t('manage.title_short')}</span>
          </Button>
        </Link>
      </>) : (<>
        <Button variant={'outline'} className='text-sm 510:text-base font-bold' onClick={() => setLoginDialogVisible(true)}>
          <span className='hidden 1200:block'>{t('auth.login')}</span>
          <span className='block 1200:hidden'>{t(['auth.login_short', 'auth.login'])}</span>
        </Button>
        <LoginDialog 
          visible={loginDialogVisible} 
          switchToSignup={() => {
            setSignupDialogVisible(true)
            setLoginDialogVisible(false)
          }}
          onClose={() => {
            setLoginDialogVisible(false)
            getIsAuthorized()
          }}
        />
        <Button className='hidden 480:block text-sm 510:text-base font-bold' onClick={() => setSignupDialogVisible(true)}>
          <span className='hidden 1200:block'>{t('auth.signup')}</span>
          <span className='block 1200:hidden'>{t(['auth.signup_short', 'auth.signup'])}</span>
        </Button>
        <SignupDialog 
          visible={signupDialogVisible} 
          switchToLogin={() => {
            setLoginDialogVisible(true)
            setSignupDialogVisible(false)
          }}
          onClose={() => {
            setSignupDialogVisible(false)
            getIsAuthorized()
          }}
        />
      </>)}
    </div>
  )
}

function LoginDialog({ visible, switchToSignup, onClose }: {
  visible: boolean
  switchToSignup: () => void
  onClose: () => void
}) {
  const [error, setError] = React.useState('')
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const [captchaVisible, setCaptchaVisible] = React.useState(false)

  const handleSwitchToSignup = switchToSignup

  React.useEffect(() => {
    if(visible) {
      setError('')
    }
  }, [visible])

  return (
    <Dialog open={visible} onOpenChange={visible => !visible && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('login.title')}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={
            Yup.object({
              username: Yup.string()
                .matches(/^[a-zA-Z0-9_]+$/, t('form_errors.latin_only'))
                .max(16, t('form_errors.username_too_long'))
                .required(t('form_errors.required')),
              password: Yup.string()
                .max(128, t('form_errors.password_too_long'))
                .required(t('form_errors.required')),
            })
          }
          onSubmit={async (values) => {
            const request = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            })
            if (request.status === 200) {
              const response = await request.json() as { ok: false, error: 'ACCOUNT_NOT_FOUND' | 'INVALID_PASSWORD' } | { ok: true }
              if(!response.ok) {
                if(response.error === 'ACCOUNT_NOT_FOUND') {
                  setError(t('form_errors.account_not_found'))
                } else if(response.error === 'INVALID_PASSWORD') {
                  setError(t('form_errors.invalid_password'))
                } else {
                  setError(t('form_errors.unknown_error'))
                }
              } else {
                if(window.location.pathname.startsWith('/manage')) {
                  navigate('/manage', { replace: true })
                  revalidator.revalidate()
                }
                onClose()
              }
            } else {
              setError(t('form_errors.unknown_error'))
            }
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
                  type='text'
                  name='username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  placeholder={t('login.username')}
                  className={errors.username && touched.username ? 'border-red-600' : ''}
                  title={errors.username && touched.username ? errors.username : ''}
                  maxLength={16}
                  onKeyDown={e => e.key === 'Enter' && setCaptchaVisible(true)}
                />
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder={t('login.password')}
                  className={errors.password && touched.password ? 'border-red-600' : ''}
                  title={errors.password && touched.password ? errors.password : ''}
                  maxLength={128}
                  onKeyDown={e => e.key === 'Enter' && setCaptchaVisible(true)}
                />
              </div>
              <DialogDescription className='font-[montserrat]'>
                {t('login.hint.0')}{' '}
                <Button variant='link' className='inline-block p-0 h-fit' type='button' onClick={handleSwitchToSignup}>
                  {t('login.hint.1')}
                </Button>{' '}
                {t('login.hint.2')}
              </DialogDescription>
              <DialogFooter>
                <div className='w-full flex items-center justify-between'>
                  <span className='text-red-600 font-bold text-xs'>{error}</span>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setCaptchaVisible(true)}
                    className='font-bold'
                  >{t('login.submit')}</Button>
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
              </DialogFooter>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

function SignupDialog({ visible, switchToLogin, onClose }: {
  visible: boolean
  switchToLogin: () => void
  onClose: () => void
}) {
  const [error, setError] = React.useState('')
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const [captchaVisible, setCaptchaVisible] = React.useState(false)

  const handleSwitchToLogin = switchToLogin

  React.useEffect(() => {
    if(visible) {
      setError('')
    }
  }, [visible])

  return (
    <Dialog open={visible} onOpenChange={visible => !visible && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('signup.title')}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{ username: '', password: '', displayName: '', captcha: '' }}
          validationSchema={
            Yup.object({
              username: Yup.string()
                .matches(/^[a-zA-Z0-9_]+$/, t('form_errors.latin_only'))
                .max(16, t('form_errors.username_too_long'))
                .required(t('form_errors.required')),
              displayName: Yup.string()
                .max(36, t('form_errors.displayName_too_long')),
              password: Yup.string()
                .max(128, t('form_errors.password_too_long'))
                .required(t('form_errors.required')),
            })
          }
          onSubmit={async (values) => {
            const request = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: values.username,
                password: values.password,
                ...(values.displayName ? { displayName: values.displayName } : {}),
                captcha: values.captcha
              })
            })
            if(request.status === 200) {
              const response = await request.json() as { ok: false, error: 'USERNAME_CONFLICT' | 'USERNAME_NOT_SAFE' | 'DISPLAY_NAME_NOT_SAFE' } | { ok: true }
              if (!response.ok) {
                if (response.error === 'USERNAME_CONFLICT') {
                  setError(t('form_errors.username_conflict'))
                } else if (response.error === 'USERNAME_NOT_SAFE') {
                  setError(t('form_errors.username_not_safe'))
                } else if (response.error === 'DISPLAY_NAME_NOT_SAFE') {
                  setError(t('form_errors.display_name_not_safe'))
                } else {
                  setError(t('form_errors.unknown_error'))
                }
              } else {
                if (window.location.pathname.startsWith('/manage')) {
                  navigate('/manage')
                  revalidator.revalidate()
                }
                onClose()
              }
            } else {
              setError(t('form_errors.unknown_error'))
            }
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
                  type='text'
                  name='username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  placeholder={t('signup.username')}
                  className={errors.username && touched.username ? 'border-red-600' : ''}
                  title={errors.username && touched.username ? errors.username : ''}
                  maxLength={16}
                  onKeyDown={e => e.key === 'Enter' && setCaptchaVisible(true)}
                />
                <Input
                  type="text"
                  name='displayName'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.displayName}
                  placeholder={t('signup.displayName')}
                  className={errors.displayName && touched.displayName ? 'border-red-600' : ''}
                  title={errors.displayName && touched.displayName ? errors.displayName : ''}
                  maxLength={36}
                  onKeyDown={e => e.key === 'Enter' && setCaptchaVisible(true)}
                />
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder={t('signup.password')}
                  className={errors.password && touched.password ? 'border-red-600' : ''}
                  title={errors.password && touched.password ? errors.password : ''}
                  maxLength={128}
                  onKeyDown={e => e.key === 'Enter' && setCaptchaVisible(true)}
                />
              </div>
              <DialogDescription className='font-[montserrat]'>
                {t('signup.hint.0')}{' '}
                <Button variant='link' className='inline-block p-0 h-fit' type='button' onClick={handleSwitchToLogin}>
                  {t('signup.hint.1')}</Button>
              </DialogDescription>
              <DialogFooter>
                <div className='w-full flex flex-col gap-4 510:gap-0 510:flex-row items-center justify-between'>
                  <span className='text-red-600 font-bold text-sm'>{error}</span>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setCaptchaVisible(true)}
                    className='font-bold'
                  >{t('signup.submit')}</Button>
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
              </DialogFooter>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

function LogoutDialog({ visible, onClose }: {
  visible: boolean
  onClose: () => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const request = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if(request.status === 200) {
        if (window.location.pathname.startsWith('/manage')) {
          navigate('/manage', { replace: true })
        }
        onClose()
      } else {
        console.error(request)
        setError(t('form_errors.unknown_error'))
      }
    } catch(e) {
      console.error(e)
      setError(t('form_errors.unknown_error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={visible} onOpenChange={visible => !visible && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('logout.title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription className='font-[montserrat]'>{t('logout.text')}</DialogDescription>
        <DialogFooter>
          <div className='w-full flex items-center justify-between'>
            <span className='text-red-600 font-bold text-sm'>{error}</span>
            <Button disabled={isLoading} onClick={handleLogout} className='font-bold'>{t('logout.submit')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}