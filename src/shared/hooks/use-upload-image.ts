
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import ServerAPI from '../lib/api/api'
import { ImageUpload } from '../lib/types/upload'
import { getNextAuthToken } from '../lib/util/auth.util'

export default function useUploadImage() {

    const [uploadProgress, setUploadProgress] = useState(0)

    const data = useMutation({
        mutationFn: async (image: File) => {
            const jwt = await getNextAuthToken();
            const token = jwt?.accessToken;
            const formData = new FormData();
            formData.append("image", image, image.name);

            const res = await ServerAPI.post<ImageUpload>(`/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                onUploadProgress: (ProgressEvent) => {
                    const { loaded, total } = ProgressEvent
                    if (total) { setUploadProgress(Math.round((loaded * 100) / total)) }
                }
            });
            return res.data.payload
        }
    })

    

    return { ...data, uploadProgress }
}
