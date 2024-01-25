import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/shared/shadcn/ui/dialog'

export function BotFullDescription({ description, visible, onClose }: {
  description: string
  visible: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={visible} onOpenChange={visible => !visible && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogDescription 
          className='font-[montserrat] flex-1 [overflow-wrap:anywhere] whitespace-pre-wrap max-h-[80vh] overflow-auto'
        >
          {description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}