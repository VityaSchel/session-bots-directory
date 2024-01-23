import { useTranslation } from 'react-i18next'
import plural from 'plural-ru'

export function OnlineBots({ bots }: {
  bots: number
}) {
  const { t } = useTranslation('landing')

  return (
    <div className='flex gap-4 items-center font-[montserrat] text-md xl:text-lg reveal-2'>
      <span className='bg-brand rounded-full w-3 h-3 shadow-brand' style={{ boxShadow: '0px 0px 6px 0px var(--tw-shadow-color)' }} />
      <span>
        <span className='tabular-nums font-mono'>{String(bots)}</span>{' '}
        {plural(bots, t(['bots_online.0', 'bots_online']), t(['bots_online.1', 'bots_online']), t(['bots_online.2', 'bots_online']))}
      </span>
    </div>
  )
}