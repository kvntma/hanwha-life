export interface AdminNotification {
    id: string;
    type: 'new_order' | 'etransfer_reference_submitted' | 'order_status_change';
    title: string;
    message: string;
    order_id: string | null;
    read: boolean;
    created_at: string;
}
