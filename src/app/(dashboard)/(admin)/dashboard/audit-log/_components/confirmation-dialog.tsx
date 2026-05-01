import { Button } from '@/shared/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ClearAll } from '../api/audit-log.api'

export default function ConfirmClearAll() {
    const { mutate: Clear, isPending } = useMutation({
        mutationFn: async () => {
            const res = await ClearAll()
            return res
        },
        onError: (res) => {
            toast.error(res.message)
        },
        onSuccess: (res) => {
            toast.success(res.message)
        }
    })
    return (
        <DialogContent className='rounded-none flex flex-col pt-13.5 pb-6 px-9'>
            <DialogHeader className='**:flex flex-col **:justify-center **:items-center items-center *:text-center'>
                <div className=' rounded-full size-27.5 bg-red-50 justify-center items-center'>
                    <div className='size-20 bg-red-100 rounded-full'>
                        <AlertTriangle size={50} className='text-red-600' />
                    </div>
                </div>
                <DialogTitle className='text-red-500'>
                    Are you sure you want to clear all logs?
                </DialogTitle>
                <DialogDescription className='text-center w-full'>
                    This action is permanent and cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className='sm:justify-center **:w-1/2 **:rounded-none px-5.25'>
                <DialogClose asChild>
                    <Button variant={'secondary'} className=' hover:border hover:border-gray-400'>Cancel</Button>
                </DialogClose>
                <Button variant={'destructive'} onClick={() => Clear()}
                    disabled={isPending}
                    className='hover:bg-transparent border hover:border-destructive hover:text-destructive duration-200'>
                    Yes, Clear
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
