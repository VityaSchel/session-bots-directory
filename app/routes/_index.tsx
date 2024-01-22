import type { MetaFunction } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import { OnlineBots } from '@/features/online-bots'
import { Link } from '@remix-run/react'
import { LuClock2 } from 'react-icons/lu'
import { BsStars } from 'react-icons/bs'
import { RiToolsLine } from 'react-icons/ri'

export const meta: MetaFunction = () => {
  return [
    { title: 'Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
  ]
}

export default function Homepage() {
  const { t } = useTranslation(['common', 'landing'])

  return (
    <div className='flex items-center justify-center gap-[10vw]' style={{ height: 'calc(100vh - 112px)' }}>
      <div className='flex flex-col gap-2 max-w-[700px]'>
        <h1 className='text-4xl uppercase font-bold'>{t('title')}</h1>
        <h2 className='text-xl font-normal'>{t('description')}</h2>
        <OnlineBots />
        <CTAForm />
      </div>
      <div className='max-w-[500px] flex flex-col gap-2'>
        <PageLink
          icon={<LuClock2 />}
          to='/search?sort=new'
          title={t('links.new.title', { ns: 'landing' })}
          description={t('links.new.description', { ns: 'landing' })}
        />
        <PageLink
          icon={<BsStars />}
          to='/search?sort=popular'
          title={t('links.popular.title', { ns: 'landing' })}
          description={t('links.popular.description', { ns: 'landing' })}
        />
        <PageLink
          icon={<RiToolsLine />}
          to='https://github.com/VityaSchel/session-nodejs-bot'
          title={t('links.byo.title', { ns: 'landing' })}
          description={t('links.byo.description', { ns: 'landing' })}
        />
        <PageLink
          ads
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M9 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-4.991 9A2.001 2.001 0 0 0 2 13c0 1.691.833 2.966 2.135 3.797C5.417 17.614 7.145 18 9 18c.41 0 .816-.019 1.21-.057A5.477 5.477 0 0 1 9 14.5c0-1.33.472-2.55 1.257-3.5zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4.024-2.64a.494.494 0 0 0-.952 0l-.477 1.532H12c-.484 0-.686.647-.294.944l1.25.947l-.477 1.532c-.15.48.378.88.77.583l1.25-.947l1.25.947c.392.297.92-.103.77-.583l-.477-1.532l1.25-.947c.392-.297.19-.944-.294-.944h-1.545z"></path></svg>}
          to='https://t.me/hlothdev'
          title={t('links.ads.title', { ns: 'landing' })}
          description={t('links.ads.description', { ns: 'landing' })}
        />
      </div>
    </div>
  )
}

function PageLink({ to, icon, title, description, ads }: {
  to: string
  icon: React.ReactNode
  title: string
  description: string
  ads?: boolean
}) {
  const { t } = useTranslation()

  return (
    <Link to={to} className='font-[montserrat]'>
      <div className='flex items-center gap-4 p-4 rounded-md border border-neutral-900 hover:border-neutral-400 transition-colors'>
        <div className='w-[4rem] shrink-0 h-full flex items-center justify-center text-3xl'>{icon}</div>
        <div className='flex-col gap-2'>
          <h3 className='font-medium text-neutral-300 w-full relative'>
            {title}
            {ads && <span className='text-[7px] absolute right-0 border px-1 py-0.5 border-neutral-600 text-neutral-600 rounded-sm'>{t('ads')}</span>}
          </h3>
          <p className='font-normal !text-neutral-500'>{description}</p>
        </div>
      </div>
    </Link>
  )
}