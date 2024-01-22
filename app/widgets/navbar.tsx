import { Form, Link, NavLink } from '@remix-run/react'
import LogoSmall from '../../assets/logo-small.png'
import { useTranslation } from 'react-i18next'

export const handle = { i18n: 'navbar' }

export function NavBar() {
  const { t } = useTranslation('navbar')
  
  return (
    <nav className='w-full h-20 flex p-4 bg-neutral-900'>
      <Link to="/">
        <img 
          src={LogoSmall} 
          alt='Session Bots Directory logo' 
          className='h-full'
        />
      </Link>
      <PageLink to='/new'>{t('new')}</PageLink>
      <PageLink to='/popular'>{t('popular')}</PageLink>
      <Search />
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
  return (
    <div className='font-sans text-black'>
      
    </div>
  )
}