import { Suspense } from 'react'
import ResetPasswordComponent from '../_components/reset-password'

export default function page() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordComponent />
        </Suspense>
    )
}
