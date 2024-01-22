import React from 'react'
import { Link, NavLink, useNavigate } from '@remix-run/react'
import LogoSmall from '../../assets/logo-small.png'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/shadcn/ui/input'
import { Button } from '@/shared/shadcn/ui/button'
import cx from 'classnames'

export const handle = { i18n: 'navbar' }

export function NavBar() {
  const { t } = useTranslation('navbar')
  
  return (
    <nav className='w-full h-20 flex items-center p-4 bg-neutral-900 justify-between gap-4'>
      <div className='flex items-center gap-6 lg:gap-12 xl:gap-20 h-full'>
        <Link to="/" className='block h-full'>
          <img 
            src={LogoSmall} 
            alt='Session Bots Directory logo' 
            className='h-full'
          />
        </Link>
        <div className='hidden items-center gap-8 mdlg:flex'>
          <PageLink to='/new'>
            <span className='hidden xl20:block'>{t('new')}</span>
            <span className='block xl20:hidden'>{t('new_short')}</span>
          </PageLink>
          <PageLink to='/popular'>
            <span className='hidden xl20:block'>{t('popular')}</span>
            <span className='block xl20:hidden'>{t('popular_short')}</span>
          </PageLink>
        </div>
      </div>
      <Search />
      <div className='flex items-center gap-4'>
        <Button variant={'outline'}>
          <span className='hidden 1200:block'>{t('auth.login')}</span>
          <span className='block 1200:hidden'>{t(['auth.login_short', 'auth.login'])}</span>
        </Button>
        <Button>
          <span className='hidden 1200:block'>{t('auth.signup')}</span>
          <span className='block 1200:hidden'>{t(['auth.signup_short', 'auth.signup'])}</span>
        </Button>
      </div>
    </nav>
  )
}

function PageLink({ to, children }: React.PropsWithChildren<{
  to: string
}>) {
  return (
    <NavLink to={to}>
      {children}
    </NavLink>
  )
}

function Search() {
  const { t } = useTranslation('navbar')
  const navigate = useNavigate()
  const [value, setValue] = React.useState('')
  const [focused, setFocused] = React.useState(false)

  const wide = focused || value.length > 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      navigate(`/search?q=${value}`)
      setValue('')
    }
  }

  return (
    <div 
      className={cx('hidden sm40:block font-sans transition-all max-w-64', {
        'flex-auto': wide,
        'flex-none': !wide
      })}
    >
      <Input 
        value={value}
        type='search' 
        placeholder={t('search.placeholder')} 
        onChange={e => setValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}