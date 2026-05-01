'use client'
import { useMutation, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { delDiploma, getDiplomaInfo, setDiplomaImmutability } from "../api/diplomas.api"
import Image from "next/image"
import { Button } from "@/shared/components/ui/button"
import { Ban, PenLine, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/shared/components/ui/skeleton"

export default function AdminViewDiplomaInfoComponent() {
    const params = useSearchParams()
    const diplomaId = params.get('diplomaId') as string

    const path = usePathname()

    const router = useRouter()

    const { data, isLoading: diplomaLoading, isError: diplomaError } = useQuery({
        queryKey: ['diploma', diplomaId],
        queryFn: () => getDiplomaInfo(diplomaId as string),
        retry: false
    })

    const { mutate: diplomaDelete } = useMutation({
        mutationFn: async (diplomaId: string) => {
            const res = await delDiploma(diplomaId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
            router.push('/dashboard/diplomas')
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    const { mutate: diplomaImmutability } = useMutation({
        mutationFn: async (diplomaId: string) => {
            const res = await setDiplomaImmutability(diplomaId)
            return res
        },
        onSuccess: (res) => {
            toast.success(res.message)
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    const diplomaTitle = data?.payload.diploma.title
    const diplomaImg = data?.payload?.diploma?.image as string
    const diplomaDescription = data?.payload.diploma.description


    if (path.includes('undefined') || diplomaError) {
        return <div className="h-[80dvh] flex items-center justify-center">There is no diploma found</div>
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-lg font-semibold font-inter`}>{diplomaTitle}</h2>
                </div>
                <div className="*:rounded-none space-x-2.5 *:space-x-2.5">
                    <Button variant={"secondary"} onClick={() => diplomaImmutability(diplomaId)}>
                        <Ban />Immutable
                    </Button>
                    <Button variant={"ghost"} className="bg-blue-600 text-white" onClick={() => router.push(`/dashboard/diplomas/edit-diploma?diplomaId=${diplomaId}`)}>
                        <PenLine />Edit
                    </Button>
                    <Button variant={"destructive"} onClick={() => diplomaDelete(diplomaId)}>
                        <Trash2 />Delete
                    </Button>
                </div>
            </div>

            <div className="mt-7 [&_h5]:text-sm [&_p]:text-sm [&_h5]:text-gray-400 *:space-y-1 space-y-4">
                <div>
                    <h5>Image</h5>
                    <div className="relative size-75">
                        {diplomaLoading ?
                            <Skeleton className="size-full bg-gray-500 rounded-lg" />
                            :
                            <Image src={diplomaImg} alt={`${diplomaTitle}`} fill className="object-scale-down" />
                        }
                    </div>
                </div>
                <div>
                    <h5>Title</h5>
                    {diplomaLoading ?
                        <Skeleton className="h-3.5 w-1/2 bg-gray-500 rounded" />
                        :
                        <p>{diplomaTitle}</p>
                    }
                </div>
                <div>
                    <h5>Description</h5>
                    {diplomaLoading ?
                        <Skeleton className="h-3.5 w-1/2 bg-gray-500 rounded" />
                        :
                        <p>{diplomaDescription}</p>
                    }
                </div>
            </div>
        </>
    )
}
