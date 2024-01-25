import React from 'react'
import { MetaFunction } from '@remix-run/node'
import { useTranslation } from 'react-i18next'

export const handle = { i18n: 'privacy-policy' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Privacy Policy — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Privacy Policy' }
  ]
}

export default function PrivacyPolicyPage() {
  const { t } = useTranslation('privacy-policy')

  return (
    <div className='w-full flex justify-center mt-16'>
      <div className='flex justify-center items-center flex-col w-[800px] max-w-full text-center'>
        <h1 className='text-6xl font-bold'>{t('title')}</h1>
        <h2 className='mt-10'>{t('description_accounts')}</h2>
        <ol className='flex flex-col gap-2 mt-8 text-left text-sm list-decimal w-[600px]'>
          <li><Field>id</Field> — {t('list.account.id')}</li>
          <li><Field>username</Field> — {t('list.account.username')}</li>
          <li><Field>displayName</Field> — {t('list.account.displayName')}</li>
          <li><Field>createdAt</Field> — {t('list.account.createdAt')}</li>
          <li><Field>passwordHash</Field> — {t('list.account.passwordHash')}</li>
          <li><Field>bots</Field> — {t('list.account.bots')}</li>
        </ol>
        <h2 className='mt-10'>{t('description_bots')}</h2>
        <ol className='flex flex-col gap-2 mt-4 text-left text-sm list-decimal w-[600px]'>
          <li><Field>id</Field> — {t('list.bot.id')}</li>
          <li><Field>name</Field> — {t('list.bot.name')}</li>
          <li><Field>description</Field> — {t('list.bot.description')}</li>
          <li><Field>createdAt</Field> — {t('list.bot.createdAt')}</li>
          <li><Field>views</Field> — {t('list.bot.views')}</li>
          <li><Field>author</Field> — {t('list.bot.author')}</li>
          <li><Field>status</Field> — {t('list.bot.status')}</li>
          <li><Field>lastChecked</Field> — {t('list.bot.lastChecked')}</li>
          <li><Field>checksFails</Field> — {t('list.bot.checksFails')}</li>
        </ol>
        <img 
          className='mt-10'
          src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Thats_all_folks.svg" 
          alt="That's all, folks!" 
          width={600} 
        />
        <h2 className='text-4xl font-bold mt-20'>{t('subtitle')}</h2>
        <p className='mt-6'>{t('description_delete')}</p>
        <h2 className='text-4xl font-bold mt-20'>{t('subtitle2')}</h2>
        <p className='mt-6 mb-16'>{t('description_github')} <a href="https://github.com/vityaSchel/session-bots-directory" target="_blank" rel="noreferrer" className='font-bold hover:text-brand'>VityaSchel/session-bots-directory</a></p>
      </div>
    </div>
  )
}

function Field({ children }: React.PropsWithChildren) {
  return (
    <span className="before:content-['“'] after:content-['”'] font-bold">{children}</span>
  )
}