import React from 'react'
import { Input } from '@/shared/shadcn/ui/input'
import { useNavigate } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/shadcn/ui/button'
import Cookies from 'js-cookie'

export function CTAForm() {
  const { t } = useTranslation('landing')
  const navigate = useNavigate()
  const [value, setValue] = React.useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  const handleNext = () => {
    const isAuthorized = Cookies.get('sessionbots.directory_authorized')
    if (isAuthorized) {
      navigate(`/manage/add?sessionid=${value}`)
    } else {
      navigate(`/?signup_botid=${value}`)
    }
  }

  return (
    <div className='flex flex-col w-full gap-2 xl:flex-row xl:gap-4 xl:items-center mt-2 reveal-3'>
      <span className='text-xs ml-4 xl:ml-0 xl:flex-1'>{t('cta.label')}</span>
      <div className='flex gap-4 items-center flex-1 xl:flex-[3]'>
        <Input
          value={value}
          type='search'
          placeholder={t('cta.placeholder')}
          onChange={e => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleNext} className='hover:bg-brand'>{t('cta.submit')}</Button>
      </div>
    </div>
  )
}