import { Button } from '@/shared/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/ui/dialog'
import { Input } from '@/shared/shadcn/ui/input'
import { Label } from '@/shared/shadcn/ui/label'
import HCaptcha from '@hcaptcha/react-hcaptcha'

export function CaptchaDialog({ visible, onSolve, onCancel }: {
  visible: boolean,
  onSolve: (token: string) => void
  onCancel: () => void
}) {
  return (
    <Dialog open={visible} onOpenChange={(newVisible) => visible && onCancel()}>
      <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={e => e.preventDefault()}>
        <HCaptcha
          sitekey="c393c3af-1017-43a3-9988-c9a91c1913b4"
          onVerify={onSolve}
        />
      </DialogContent>
    </Dialog>
  )
}
