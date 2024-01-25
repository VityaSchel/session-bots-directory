import cx from 'classnames'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/shadcn/ui/tooltip'
import { useTranslation } from 'react-i18next'

export function OnlineOfflineIndicator({ offlineFails, online, className }: {
  online: boolean
  className?: string
  offlineFails: number
}) {
  const { t } = useTranslation('common')

  const failsToTime = (fails: number) => {
    const hours = fails * 2
    if (hours < 24) {
      return hours + ' ' + t('hours')
    } else {
      return Math.floor(hours / 24) + ' ' + t('days')
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='cursor-default'>
          <span 
            className={cx(
              'inline-block rounded-full w-2.5 h-2.5 align-middle ml-2',
              online ? 'bg-green-500' : 'bg-neutral-500',
              online ? 'shadow-green-500' : 'shadow-neutral-500',
              className
            )} 
            style={{
              boxShadow: '0px 0px 6px 0px var(--tw-shadow-color)'
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{online 
            ? t('bot_online')
            : t('bot_offline') + ' ~' + failsToTime(offlineFails ?? 0)
          }</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}