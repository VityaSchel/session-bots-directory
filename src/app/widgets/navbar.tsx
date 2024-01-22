import { Link } from '@remix-run/react'
import LogoSmall from '../../assets/logo-small.png'

export function NavBar() {
  return (
    <nav className='w-full h-20 flex p-4 bg-neutral-900'>
      <Link to="/">
        <img 
          src={LogoSmall} 
          alt='Session Bots Directory logo' 
          className='h-full'
        />
      </Link>
    </nav>
  )
}