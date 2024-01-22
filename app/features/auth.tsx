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

export function Auth() {
  const { t } = useTranslation('navbar')
  const [loginDialogVisible, setLoginDialogVisible] = React.useState(false)
  const [signupDialogVisible, setSignupDialogVisible] = React.useState(false)

  return (
    <div className='flex items-center gap-4'>
      <Button variant={'outline'} className='font-bold' onClick={() => setLoginDialogVisible(true)}>
        <span className='hidden 1200:block'>{t('auth.login')}</span>
        <span className='block 1200:hidden'>{t(['auth.login_short', 'auth.login'])}</span>
      </Button>
      <LoginDialog 
        visible={loginDialogVisible} 
        switchToSignup={() => {
          setSignupDialogVisible(true)
          setLoginDialogVisible(false)
        }}
        onClose={() => setLoginDialogVisible(false)}
      />
      <Button className='font-bold' onClick={() => setSignupDialogVisible(true)}>
        <span className='hidden 1200:block'>{t('auth.signup')}</span>
        <span className='block 1200:hidden'>{t(['auth.signup_short', 'auth.signup'])}</span>
      </Button>
      <SignupDialog 
        visible={signupDialogVisible} 
        switchToLogin={() => {
          setLoginDialogVisible(true)
          setSignupDialogVisible(false)
        }}
        onClose={() => setSignupDialogVisible(false)}
      />
    </div>
  )
}

function LoginDialog({ visible, switchToSignup, onClose }: {
  visible: boolean
  switchToSignup: () => void
  onClose: () => void
}) {
  const { t } = useTranslation('auth')

  const handleSwitchToSignup = switchToSignup

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
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              setSubmitting(false)
            }, 400)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
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
                />
              </div>
              <DialogDescription className='font-[montserrat]'>
                Забыли пароль? <Button variant='link' className='inline-block p-0 h-fit' type='button' onClick={handleSwitchToSignup}>Создайте новый аккаунт</Button> и перенесите ботов туда.
              </DialogDescription>
              <DialogFooter>
                <Button type="submit">{t('login.submit')}</Button>
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
  const { t } = useTranslation('auth')

  const handleSwitchToLogin = switchToLogin

  return (
    <Dialog open={visible} onOpenChange={visible => !visible && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('signup.title')}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{ username: '', password: '', displayName: '' }}
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
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              setSubmitting(false)
            }, 400)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
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
                />
              </div>
              <DialogDescription className='font-[montserrat]'>
                Уже есть аккаунт? <Button variant='link' className='inline-block p-0 h-fit' type='button' onClick={handleSwitchToLogin}>Войдите в него</Button>
              </DialogDescription>
              <DialogFooter>
                <Button type="submit">{t('signup.submit')}</Button>
              </DialogFooter>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}