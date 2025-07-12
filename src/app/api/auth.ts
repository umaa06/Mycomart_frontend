import { api} from '@/app/api/apiClient';

export const authService = {
    login: ( credential: { userName: string; password: string }) => {
        return api.post<{ token: string }>('/auth/login', credential);
    }
}
