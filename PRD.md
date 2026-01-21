# 🛒 PRD: Local Delivery E-Commerce Platform – "Bruh, Chicken"

## 📌 Overview

An e-commerce platform for selling and delivering pre-made meals (chicken-based products) to local customers. The store features a modern user interface, real-time updates, admin CMS for product/inventory management, and a manual E-Transfer payment flow to avoid processing fees.

---

## 🎯 Goals

- Allow customers to browse, select, and purchase meals online.
- Provide a smooth UI/UX for authentication and account management using Supabase Auth.
- Implement a cost-effective "E-Transfer" payment workflow.
- Enable admin users to manage products, tracking orders, and verify payments via a Dashboard.
- Provide real-time order status updates to users.

---

## 🧩 Tech Stack

| Area            | Tool                | Purpose                                                 |
| --------------- | ------------------- | ------------------------------------------------------- |
| Frontend        | React + TypeScript  | UI + State Management                                   |
| Data Fetching   | React Query         | Cache, prefetching, and mutation of Supabase data       |
| Auth            | Supabase Auth       | Authentication, Social Login (Google/GitHub), RBAC      |
| Backend         | Supabase (Postgres) | DB management for products, users, orders, deliveries   |
| Payments        | E-Transfer (Manual) | Manual payment verification to avoid fees               |
| CMS             | Custom / Shadcn UI  | Admin dashboard for managing meals, orders, and windows |

---

## Authentication

### Tasks:

- [x] Integrate Clerk UI for sign-up, login, and session.
- [x] Connect Clerk to Supabase for session management.
- [x] Add Supabase role-based access control for admin users.
- [x] Secure protected routes in the CMS using Clerk + Supabase roles.

---

## Product & Inventory Flow

### Tasks:

- [x] Create Supabase `products` table with fields: `id`, `name`, `description`, `price`, `inventory_count`, `stripe_product_id`, `available`.
- [x] Build CMS UI form to add/edit/delete products.
- [x] Use React Query to fetch `products` for frontend display.
- [ ] Implement inventory tracking (optional: basic availability toggle).

---

## Shopping Cart

### Tasks:

- [x] Create `carts` and `cart_items` tables in Supabase.
- [x] Implement cart persistence logic (items expire after 24 hours).
- [x] Create RLS policies for cart access (users can only see their own carts).
- [x] Update frontend to use Supabase for cart operations (add, remove, update quantity).
- [x] Migrate from local storage/hardcoded cart to Supabase-backed cart.

---

## Checkout & Payments (E-Transfer Flow)

### Concept:
To avoid fees, the system uses a manual tracking system. Users place an order, receiving an Order ID, and manually send an Interac E-Transfer. Admins match the transfer to the Order ID in the dashboard.

### Tasks:

- [x] Create `orders` table in Supabase (`id`, `user_id`, `items`, `total`, `status`, `delivery_window`, `created_at`).
    - Statuses: `pending_payment`, `payment_verified`, `preparing`, `out_for_delivery`, `delivered`, `cancelled`.
- [x] Build Checkout Form:
    - [x] User details (name, address, phone).
    - [x] Delivery window selection.
    - [x] Order summary.
- [x] "Place Order" Action:
    - [x] Creates record in `orders` table with status `pending_payment`.
    - [x] Redirects to "Order Confirmation" page.
- [x] Order Confirmation Page:
    - [x] Displays **Order ID**.
    - [x] Instructions: "Please Send E-Transfer of **$[Total]** to **payments@bruhchicken.com**".
    - [x] Instructions: "Include Order ID **#[ID]** in the transfer message."
- [x] **Admin Notifications**:
    - [x] Create admin notification system for new orders.
    - [x] Send email/in-app notification when order is placed.
    - [x] Send notification when customer submits e-transfer reference.

---

## Admin Dashboard (CMS)

### Tasks:

- [x] **Order Management Dashboard**:
    - [x] List all orders (filterable by status: `pending_payment`, `active`).
    - [x] View order details (items, customer info, total).
    - [x] **Mark as Paid**: Button to confirm E-Transfer received -> updates status to `preparing`.
    - [x] **Update Status**: Workflow buttons (`Preparing` -> `Out for Delivery` -> `Delivered`).
- [ ] **Product Management**:
    - [x] Implement product CRUD UI.
    - [ ] Upload images to Supabase Storage.
- [ ] **Data Visualization**:
    - Revenue tracking (sum of paid orders).
    - Basic sales charts.

---

## Delivery System

### Tasks:

- [ ] Create `delivery_windows` table (or hardcode initially).
- [ ] Allow users to select delivery preference during checkout.
- [ ] Admin view of "Today's Deliveries" (Orders with status `out_for_delivery` or `preparing`).

---

## React Query Strategy

### Tasks:

- [x] Set up `useQuery` hooks with unique keys (`products`, `orders`, `inventory`).
- [x] Create mutations (`createOrder`, `updateInventory`, `createProduct`).
- [ ] Real-time subscription (Supabase Realtime) for Admin Dashboard new orders.
- [ ] Optimistic updates for Admin status changes.

---

## Future Features

- [ ] Automated SMS notifications (Twilio) when status changes.
- [ ] User "My Orders" history page.

- [ ] Mobile App (React Native).
