import { useTranslation } from 'react-i18next'
import plural from 'plural-ru'

export function OnlineBots() {
  const { t } = useTranslation('landing')

  const bots = 123

  return (
    <div className='flex gap-4 items-center mt-6 font-[montserrat] text-lg'>
      <span className='bg-brand rounded-full w-3 h-3 shadow-brand shadow-sm' />
      <span>
        <span className='tabular-nums font-mono'>{String(bots)}</span>{' '}
        {plural(bots, t(['bots_online.0', 'bots_online']), t(['bots_online.1', 'bots_online']), t(['bots_online.2', 'bots_online']))}
      </span>
    </div>
  )
}