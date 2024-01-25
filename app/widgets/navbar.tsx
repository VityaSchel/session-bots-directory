import React from 'react'
import { Link, NavLink, useNavigate, useNavigation } from '@remix-run/react'
import LogoSmall from '../../assets/logo-small.png'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/shadcn/ui/input'
import { Button } from '@/shared/shadcn/ui/button'
import cx from 'classnames'
import { Auth } from '@/features/auth'

export const handle = { i18n: 'navbar' }

export function NavBar() {
  const { t } = useTranslation('navbar')
  
  return (
    <nav className='w-full h-20 flex items-center p-4 bg-neutral-900 justify-between gap-4 font-bold z-10 fixed top-0'>
      <div className='flex items-center gap-6 lg:gap-12 xl:gap-20 h-full'>
        <Link to="/" className='flex h-full items-center'>
          <img 
            src={LogoSmall} 
            alt='Session Bots Directory logo' 
            className='h-full'
          />
        </Link>
        <div className='hidden items-center gap-8 mdlg:flex'>
          <PageLink to='/search?q=&sort=newest'>
            <span className='hidden xl20:block'>{t('new')}</span>
            <span className='block xl20:hidden'>{t('new_short')}</span>
          </PageLink>
          <PageLink to='/search?q=&sort=popular'>
            <span className='hidden xl20:block'>{t('popular')}</span>
            <span className='block xl20:hidden'>{t('popular_short')}</span>
          </PageLink>
        </div>
      </div>
      <Search />
      <Auth />
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
  const navigation = useNavigation()
  const [value, setValue] = React.useState('')
  const [focused, setFocused] = React.useState(false)

  const wide = focused || value.length > 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      navigate(`/search?q=${value}`)
      setValue('')
      setFocused(false);
      (document.activeElement as HTMLInputElement | null)?.blur()
    }
  }

  const handleFocus = () => {
    if (window.location?.pathname === '/search') {
      (document.querySelector('#q') as HTMLInputElement | null)?.focus()
    } else {
      return true
    }
  }

  return (
    <div 
      className={cx('hidden sm40:block font-sans transition-all max-w-64 font-normal', {
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
        onFocus={() => { handleFocus() && setFocused(true) }}
        onBlur={() => setFocused(false)}
        onClick={handleFocus}
      />
    </div>
  )
}