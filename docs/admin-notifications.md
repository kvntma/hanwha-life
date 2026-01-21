# Admin Notification System Implementation

## Overview
Implemented a complete admin notification system that alerts administrators when:
1. A new order is placed
2. A customer submits an e-transfer reference number

## Components Created

### 1. Database Layer

#### Migration: `20260121000002_create_admin_notifications.sql`
- Created `admin_notifications` table with fields:
  - `id`: UUID primary key
  - `type`: Notification type ('new_order', 'etransfer_reference_submitted', 'order_status_change')
  - `title`: Notification title
  - `message`: Notification message
  - `order_id`: Reference to the related order
  - `read`: Boolean flag for read status
  - `created_at`: Timestamp

- **Database Triggers**:
  - `notify_admin_new_order()`: Automatically creates a notification when a new order is inserted
  - `notify_admin_etransfer_reference()`: Creates a notification when an e-transfer reference is submitted

- **RLS Policies**: Only admins can view and update notifications

#### Migration: `20260121000003_add_etransfer_reference.sql`
- Added `etransfer_reference` column to the `orders` table to store customer-submitted bank reference IDs

### 2. TypeScript Types

#### `src/types/notification.ts`
- Defined `AdminNotification` interface with proper typing for all notification fields

### 3. Supabase Hooks

#### `src/lib/supabase/notifications.ts`
- `useAdminNotifications()` hook with methods:
  - `getNotifications()`: Fetch all notifications
  - `getUnreadCount()`: Get count of unread notifications
  - `markAsRead(id)`: Mark a single notification as read
  - `markAllAsRead()`: Mark all notifications as read
  - `subscribeToNotifications(callback)`: Real-time subscription to new notifications using Supabase Realtime

### 4. UI Components

#### `src/components/admin/notification-bell.tsx`
- Bell icon with unread count badge
- Dropdown menu showing recent notifications
- Real-time updates via Supabase Realtime
- Toast notifications for new alerts
- Click-to-navigate to related order
- "Mark all as read" functionality
- Displays notification time using `date-fns` relative formatting

#### Updated `src/app/admin/admin-nav.tsx`
- Added NotificationBell component to the admin navigation bar

## How It Works

### When a New Order is Placed:
1. User completes checkout and creates an order
2. Database trigger `notify_admin_new_order()` fires automatically
3. A notification is inserted into `admin_notifications` table
4. Supabase Realtime broadcasts the new notification to all connected admin clients
5. NotificationBell component receives the update and:
   - Updates the unread count badge
   - Shows a toast notification
   - Adds the notification to the dropdown list

### When E-Transfer Reference is Submitted:
1. Customer submits their bank reference ID on the confirmation page
2. The `orders.etransfer_reference` field is updated
3. Database trigger `notify_admin_etransfer_reference()` fires
4. Same notification flow as above

### Admin Experience:
- Admins see a bell icon in the admin nav with an unread count
- Clicking the bell shows a dropdown with all notifications
- Unread notifications are highlighted with a blue dot and background tint
- Clicking a notification marks it as read and navigates to the order
- "Mark all as read" button clears all unread notifications
- Real-time updates mean admins see new orders instantly without refreshing

## Features
✅ Real-time notifications using Supabase Realtime
✅ Unread count badge
✅ Toast notifications for new alerts
✅ Click-to-navigate to related orders
✅ Mark as read functionality
✅ Automatic notification creation via database triggers
✅ Fully typed with TypeScript
✅ Integrated with React Query for caching
✅ Responsive UI with shadcn/ui components

## Next Steps (Optional Enhancements)
- [ ] Add email notifications using a service like Resend or SendGrid
- [ ] Add SMS notifications for urgent orders
- [ ] Add notification preferences (allow admins to configure which notifications they want)
- [ ] Add notification history page with filtering and search
- [ ] Add sound alerts for new notifications
