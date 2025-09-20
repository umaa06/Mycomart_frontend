"use client"

import PasswordReset from '@/app/password-reset-request/PasswordReset';
import {useSearchParams} from 'next/navigation';

export default function Reset( ) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (token && email) {
        return(
            <div>
                <PasswordReset token={token as string} email={email as string} />
            </div>
        );
    }

}
