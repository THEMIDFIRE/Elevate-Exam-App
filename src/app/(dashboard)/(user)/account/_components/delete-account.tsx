import { Button } from '@/shared/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { DeleteAcc } from '@/shared/lib/api/account/account.api'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

export default function DeleteAccount() {
    const { mutate: Delete, isPending } = useMutation({
        mutationFn: async () => {
            const res = await DeleteAcc()
            return res
        },
        onError: (err) => {
            toast.error((err as Error).message)
        },
        onSuccess: (res) => {
            toast.success(res.message)
            signOut({ callbackUrl: '/' })
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
                <DialogTitle>
                    Are you sure you want to delete your account?
                </DialogTitle>
                <DialogDescription className='text-center w-full'>
                    This action is permanent and cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className='sm:justify-center **:w-1/2 **:rounded-none px-5.25'>
                <DialogClose asChild>
                    <Button variant={'secondary'} className=' hover:border hover:border-gray-400'>Cancel</Button>
                </DialogClose>
                <Button variant={'destructive'} onClick={() => Delete()}
                    disabled={isPending}
                    className='hover:bg-transparent border hover:border-destructive hover:text-destructive duration-200'>Yes, Delete  </Button>
            </DialogFooter>
        </DialogContent>
    )
}