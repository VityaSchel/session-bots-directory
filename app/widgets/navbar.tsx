import { Link, NavLink, useNavigate } from '@remix-run/react'
import LogoSmall from '../../assets/logo-small.png'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/shadcn/ui/input'
import { Button } from '@/shared/shadcn/ui/button'

export const handle = { i18n: 'navbar' }

export function NavBar() {
  const { t } = useTranslation('navbar')
  
  return (
    <nav className='w-full h-20 flex items-center p-4 bg-neutral-900 justify-between'>
      <div className='flex items-center gap-20 h-full'>
        <Link to="/" className='block h-full'>
          <img 
            src={LogoSmall} 
            alt='Session Bots Directory logo' 
            className='h-full'
          />
        </Link>
        <div className='flex items-center gap-8'>
          <PageLink to='/new'>
            <span className='hidden xl:block'>{t('new')}</span>
            <span className='block xl:hidden'>{t('new_short')}</span>
          </PageLink>
          <PageLink to='/popular'>
            <span className='hidden xl:block'>{t('popular')}</span>
            <span className='block xl:hidden'>{t('popular_short')}</span>
          </PageLink>
        </div>
      </div>
      <Search />
      <div className='flex items-center gap-4'>
        <Button variant={'outline'}>
          <span className='hidden xl:block'>{t('auth.login')}</span>
          <span className='block xl:hidden'>{t(['auth.login_short', 'auth.login'])}</span>
        </Button>
        <Button>
          <span className='hidden xl:block'>{t('auth.signup')}</span>
          <span className='block xl:hidden'>{t(['auth.signup_short', 'auth.signup'])}</span>
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      navigate(`/search?q=${e.currentTarget.value}`)
    }
  }

  return (
    <div className='font-sans'>
      <Input 
        type='search' 
        placeholder={t('search.placeholder')} 
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}