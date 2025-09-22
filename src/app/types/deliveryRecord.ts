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
