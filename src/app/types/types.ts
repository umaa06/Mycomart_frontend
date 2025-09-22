type DeliveryRecord = {
    order_id: number | null;
    order_date: string;
    shop_name: string | null;
    shop_address: string | null;
    order_items_summary: string | null;
    total_amount: number;
    expected_delivery_date: string | null;
    delivery_date: string | null;
    status: string | null;
    delivery_person_id: number | null;
    
}
type DeliveryPerson = {
    id: string;
    user_id: string;
    full_name: string;
    phone_number: string;
    license_number: string;
    userName: string;
    email: string;
    password: string;
};
