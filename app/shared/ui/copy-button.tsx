import React from 'react'
import { Button } from '@/shared/shadcn/ui/button'
import { MdOutlineContentCopy, MdOutlineDone } from 'react-icons/md'
import copy from 'copy-to-clipboard'
import cx from 'classnames'

export function CopyButton({ children, content, onCopied, className }: React.PropsWithChildren<{
  content: string
  onCopied?: () => void
  className?: string
}>) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    copy(content)
    setCopied(true)
    onCopied?.()
  }

  return (
    <Button
      variant='outline'
      onMouseDown={handleCopy}
      onMouseOut={() => setCopied(false)} 
      className={cx(className, 'text-ellipsis')}
    >
      <span className='mr-2'>
        {copied
          ? <MdOutlineDone />
          : <MdOutlineContentCopy />}
      </span>
      <span className='md:flex text-ellipsis whitespace-nowrap inline-block w-full overflow-hidden'>
        {children}
      </span>
    </Button>
  )
}