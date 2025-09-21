import {api} from '@/app/api/apiClient';

export const authService = {
    login: ( credential: { userName: string; password: string }) => {
        return api.post<{ token: string, status: number }>('/auth/login', credential);
    },
    forgotPassword: ( credential: { email: string } ) => {
        return api.post<{}>('/auth/forgot-password', credential);
    },
    resetPassword: ( credential: { email: string, token: string, password: string } ) => {
        return api.post<{token: string, status: number }>('/auth/reset-password', credential);
    },
    logout:()=> {
        return api.post<{}>('/auth/logout', null);
    }
}
