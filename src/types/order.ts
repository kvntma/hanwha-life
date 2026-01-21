import { Product } from './product';

export type OrderStatus =
    | 'pending_payment'
    | 'payment_verified'
    | 'preparing'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';

export interface Order {
    id: string;
    user_id: string;
    transaction_id: string; // BEAST-XXXXXXXX format shown on confirmation page
    full_name: string;
    address: string;
    phone: string;
    delivery_window: string;
    total_amount: number;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
    etransfer_reference?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    product?: Product;
}
