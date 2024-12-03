import React from 'react'

export function MigrationAlert() {
  const [isMounted, setIsMounted] = React.useState(false)
  const [isOldUrl, setIsOldUrl] = React.useState(false)
  const [closed, setClosed] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
      setIsOldUrl(window.location.hostname === 'sessionbots.directory')
    }
  }, [])

  return isMounted && isOldUrl && !closed && (
    <div className='fixed top-0 left-0 z-[9999] bg-black/50 flex items-center justify-center w-full h-full'>
      <div className='bg-white p-4 rounded-sm text-black flex flex-col text-center items-center justify-center gap-2'>
        <h1 className='font-medium text-lg'>We&apos;re migrating</h1>
        <p>sessionbots.directory is now <a href='https://bots.session.community' className='underline font-medium'>bots.session.community</a></p>
        <button onClick={() => setClosed(true)} className='px-2 py-1 bg-indigo-600 text-white rounded-lg shadow-sm'>Close</button>
      </div>
    </div>
  )
}