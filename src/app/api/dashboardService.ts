import {api} from '@/app/api/apiClient';

export const dashboardService = {
    dashboardDetails: () => {
        return api.get<{ totalShops: number, totalDeliveryPersons: number, pendingOrders: number,availableToday:number }>('/dashboard');
    }
}
