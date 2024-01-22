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

const YupSchema = Yup.object({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
})

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
          validationSchema={YupSchema}
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
                />
                {errors.username && touched.username && <span className='text-red-600 text-sm font-bold'>{errors.username}</span>}
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder={t('login.password')}
                />
                {errors.password && touched.password && <span className='text-red-600 text-sm font-bold'>{errors.password}</span>}
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
          validationSchema={YupSchema}
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
                <div className='flex flex-col gap-1'>
                  <Input
                    type='text'
                    name='username'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    placeholder={t('signup.username')}
                  />
                  {errors.username && touched.username && <span className='text-red-600 text-sm font-[montserrat] font-bold ml-4 mb-1'>{errors.username}</span>}
                </div>
                <div className='flex flex-col gap-1'>
                  <Input
                    type="text"
                    name='displayName'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.displayName}
                    placeholder={t('signup.displayName')}
                  />
                  {errors.displayName && touched.displayName && <span className='text-red-600 text-sm font-[montserrat] font-bold ml-4 mb-1'>{errors.displayName}</span>}
                </div>
                <div className='flex flex-col gap-1'>
                  <Input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder={t('signup.password')}
                  />
                  {errors.password && touched.password && <span className='text-red-600 text-sm font-[montserrat] font-bold ml-4 mb-1'>{errors.password}</span>}
                </div>
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