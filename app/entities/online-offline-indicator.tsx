import cx from 'classnames'

export function OnlineOfflineIndicator({ online, className }: {
  online: boolean
  className?: string
}) {
  return (
    <span className={cx(
      'inline-block rounded-full w-3 h-3',
      online ? 'bg-green-500' : 'bg-red-500',
      className
    )} />
  )
}