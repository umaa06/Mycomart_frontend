import {api} from '@/app/api/apiClient';

export const dashboardService = {
    dashboardDetails: () => {
        return api.get<{ totalShops: number, totalDeliveryPersons: number, pendingOrders: number,availableToday:number }>('/dashboard');
    },
    registerShop( shopData: {
        shopName: string;
        contactPerson: string;
        address: string;
        phoneNumber: string;
        userName: string;
        email: string;
        password: string
    } ) {
        return api.post<{ message: string, status: number }>('/register-shop', shopData);
    },
    addDeliveryPerson( deliveryPersonData: DeliveryPerson){
        return api.post<{ message: string, status: number }>('/add-delivery-person', deliveryPersonData);
    }
}
