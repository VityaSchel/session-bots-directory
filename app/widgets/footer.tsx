import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'

export const handle = { i18n: 'footer' }

export function Footer() {
  const { t } = useTranslation('footer')
  
  return (
    <footer className='w-full p-4 flex flex-col gap-2 bg-neutral-900 text-sm text-neutral-600'>
      <span>{t('disclaimer')}</span>
      <div className='flex gap-5'>
        <Link className='hover:text-brand' to='https://github.com/vityaSchel/session-bots-directory/tree/main/GUIDELINES.md' target='_blank' rel='noreferrer'>
          {t('links.guidelines')}
        </Link>
        <Link className='hover:text-brand' to='/privacy' target='_blank' rel='noreferrer'>
          {t('links.privacy')}
        </Link>
        <Link className='hover:text-brand' to='https://t.me/hlothdev' target='_blank' rel='noreferrer'>
          {t('links.contact')}
        </Link>
        <Link className='hover:text-brand' to='https://github.com/vityaSchel/session-bots-directory/' target='_blank' rel='noreferrer'>
          {t('links.GitHub')}
        </Link>
      </div>
    </footer>
  )
}
