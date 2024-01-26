import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import TelegramLogo from '../../assets/telegram.svg'
import { CopyButton } from '@/shared/ui/copy-button'

export const handle = { i18n: 'footer' }

export function Footer() {
  const { t } = useTranslation('footer')
  
  return (
    <footer className='w-full p-4 flex flex-col-reverse md:flex-row gap-4 justify-between bg-neutral-900 text-sm text-neutral-600'>
      <div className='flex flex-col justify-between gap-2'>
        <div className='flex flex-col gap-2 flex-1'>
          <span>{t('disclaimer')}</span>
          <div className='flex flex-col 1060:flex-row gap-y-1 gap-x-2 1060:gap-x-5 flex-1 flex-wrap'>
            <Link className='hover:drop-shadow-footer-logo w-fit' to='https://t.me/session_nodejs'>
              <img src={TelegramLogo} alt='Telegram logo' width='24' />
            </Link>
            <Link className='hover:text-brand w-fit font-bold' to='https://github.com/vityaSchel/session-bots-directory/tree/main/GUIDELINES.md' target='_blank' rel='noreferrer'>
              {t('links.guidelines')}
            </Link>
            <Link className='hover:text-brand w-fit font-bold' to='/privacy' target='_blank' rel='noreferrer'>
              {t('links.privacy')}
            </Link>
            <Link className='hover:text-brand w-fit font-bold' to='https://t.me/hlothdev' target='_blank' rel='noreferrer'>
              {t('links.contact')}
            </Link>
            <Link className='hover:text-brand w-fit font-bold' to='https://github.com/vityaSchel/session-bots-directory/' target='_blank' rel='noreferrer'>
              {t('links.GitHub')}
            </Link>
          </div>
        </div>
        <div className='mt-auto'>
          {t('similar_websites')}: <Link className='hover:text-brand font-bold' to='https://oxen.directory/' target='_blank' rel='noreferrer'>oxen.directory</Link>
        </div>
      </div>
      <div className='flex items-end flex-col gap-1'>
        <span className='mb-2'>{t('support')}</span>
        <CopyButton
          content={'L6j1Kam6QQfKetnvxwyAbe2eUPFuL1bZuYeDWepm7G7cM8cGh3EZBgncrpkMFN5sRKP2pWGLdxpbLf5DRYSnhBY2PypkhLC'}
          className='md:w-auto w-full'
        >
          OXEN:
          <span className='ml-2 font-mono hidden md:block'>L6j1Kam…ypkhLC</span>
          <span className='ml-2 font-mono md:hidden'>L6j1Kam6QQfKetnvxwyAbe2eUPFuL1bZuYeDWepm7G7cM8cGh3EZBgncrpkMFN5sRKP2pWGLdxpbLf5DRYSnhBY2PypkhLC</span>
        </CopyButton>
        <CopyButton
          content={'43MTCc7BsyZip4YUpRSqGahUPf8NefifvW6KXEXttTXicTbMfAehtny26HuU84pzQNQmodxzWoTaPAL5aqPjAUo4DtkvXBV'}
          className='md:w-auto w-full'
        >
          XMR:
          <span className='ml-2 font-mono hidden md:block'>43MTCc…tkvXBV</span>
          <span className='ml-2 font-mono md:hidden'>43MTCc7BsyZip4YUpRSqGahUPf8NefifvW6KXEXttTXicTbMfAehtny26HuU84pzQNQmodxzWoTaPAL5aqPjAUo4DtkvXBV</span>
        </CopyButton>
      </div>
    </footer>
  )
}
