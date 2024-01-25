import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import { OnlineBots } from '@/features/online-bots'
import { Link, json, useLoaderData } from '@remix-run/react'
import { LuClock2 } from 'react-icons/lu'
import { BsStars } from 'react-icons/bs'
import { RiToolsLine } from 'react-icons/ri'
import { CTAForm } from '@/features/cta-form'
import cx from 'classnames'
import revealEffects from '@/shared/styles/reveal-effects.css'
import { HiOutlineChevronRight } from 'react-icons/hi2'
import { getAllBots } from '@/server/bots'

export const meta: MetaFunction = () => {
  return [
    { title: 'Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Main page' }
  ]
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: revealEffects },
]

export const loader = async () => {
  const bots = await getAllBots()
  const onlineBots = bots.filter(bot => bot.status === 'online').length

  return json({ ok: true, onlineBots })
}

export default function Homepage() {
  const { t } = useTranslation(['common', 'landing'])
  const { onlineBots } = useLoaderData<typeof loader>()

  return (
    <div className='432:p-4 flex flex-col 870:flex-row items-center justify-center gap-8 432:gap-16 870:gap-[5vw] 1060:gap-[10vw] 870:h-[var(--screen)]' style={{ '--screen': 'calc(100vh - 112px)' } as React.CSSProperties}>
      <div className='flex flex-col gap-6 max-w-[700px]'>
        <div className='flex flex-col gap-2 reveal-1'>
          <h1 className='text-3xl xl:text-4xl uppercase font-bold'>{t('title')}</h1>
          <h2 className='text-md xl:text-xl font-normal'>{t('description')}</h2>
        </div>
        <OnlineBots bots={onlineBots} />
        <CTAForm />
      </div>
      <div className='max-w-[500px] flex flex-col gap-2'>
        <PageLink
          icon={<LuClock2 />}
          to='/search?sort=newest'
          title={t('links.new.title', { ns: 'landing' })}
          description={t('links.new.description', { ns: 'landing' })}
          className='reveal-up-1'
        />
        <PageLink
          icon={<BsStars />}
          to='/search?sort=popular'
          title={t('links.popular.title', { ns: 'landing' })}
          description={t('links.popular.description', { ns: 'landing' })}
          className='reveal-up-2'
        />
        <PageLink
          icon={<RiToolsLine />}
          to='https://github.com/VityaSchel/session-nodejs-bot'
          title={t('links.byo.title', { ns: 'landing' })}
          description={t('links.byo.description', { ns: 'landing' })}
          className='reveal-up-3'
        />
        <PageLink
          ads
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M9 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-4.991 9A2.001 2.001 0 0 0 2 13c0 1.691.833 2.966 2.135 3.797C5.417 17.614 7.145 18 9 18c.41 0 .816-.019 1.21-.057A5.477 5.477 0 0 1 9 14.5c0-1.33.472-2.55 1.257-3.5zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4.024-2.64a.494.494 0 0 0-.952 0l-.477 1.532H12c-.484 0-.686.647-.294.944l1.25.947l-.477 1.532c-.15.48.378.88.77.583l1.25-.947l1.25.947c.392.297.92-.103.77-.583l-.477-1.532l1.25-.947c.392-.297.19-.944-.294-.944h-1.545z"></path></svg>}
          to='https://t.me/hlothdev'
          title={t('links.ads.title', { ns: 'landing' })}
          description={t('links.ads.description', { ns: 'landing' })}
          className='reveal-up-4'
        />
      </div>
    </div>
  )
}

function PageLink({ to, icon, title, description, ads, className }: {
  to: string
  icon: React.ReactNode
  title: string
  description: string
  ads?: boolean
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <Link to={to} className='font-[montserrat]' target={to.startsWith('http') ? '_blank' : ''} rel='noreferrer'>
      <div className={cx('flex items-center gap-4 p-4 rounded-md border border-neutral-900 hover:border-neutral-400 transition-colors [&>.chevron]:text-neutral-400', className)}>
        <div className='1060:w-[4rem] w-[2rem] shrink-0 h-full flex items-center justify-center text-3xl'>
          {icon}
        </div>
        <div className='flex-col gap-2'>
          <h3 className='font-medium text-neutral-300 w-full flex items-center text-sm xl:text-base'>
            {title}
            {ads && <span className='text-[7px] ml-4 border px-1 py-0.5 h-fit border-neutral-600 text-neutral-600 rounded-sm leading-[normal]'>{t('ads')}</span>}
          </h3>
          <p className='font-normal !text-neutral-500 text-sm xl:text-base'>{description}</p>
        </div>
        <span className='chevron'>
          <HiOutlineChevronRight />
        </span>
      </div>
    </Link>
  )
}