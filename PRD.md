# 🛒 PRD: Local Delivery E-Commerce Platform – "Bruh, Chicken"

## 📌 Overview

An e-commerce platform for selling and delivering pre-made meals (chicken-based products) to local customers. The store features a modern user interface, real-time updates, admin CMS for product/inventory management, and a robust payment/delivery integration.

---

## 🎯 Goals

- Allow customers to browse, select, and purchase meals online.
- Provide a smooth UI/UX for authentication and account management.
- Integrate a secure, scalable delivery management flow.
- Enable admin users to manage products, pricing, and delivery windows.
- Automate syncing of product data between CMS, Supabase, and Stripe.

---

## 🧩 Tech Stack

| Area            | Tool                | Purpose                                                 |
| --------------- | ------------------- | ------------------------------------------------------- |
| Frontend        | React + TypeScript  | UI + State Management                                   |
| Data Fetching   | React Query         | Cache, prefetching, and mutation of Supabase data       |
| Auth (Backend)  | Supabase Auth       | Core authentication + RBAC logic                        |
| Auth (UI Layer) | Clerk               | UI/UX enhancements + social login                       |
| Backend         | Supabase (Postgres) | DB management for products, users, orders, deliveries   |
| Payments        | Stripe              | Checkout, pricing, subscriptions, and invoices          |
| CMS             | Custom              | Admin dashboard for managing meals and delivery windows |

---

## Authentication

### Tasks:

- [ ] Integrate Clerk UI for sign-up, login, and session.
- [ ] Connect Clerk to Supabase for session management.
- [ ] Add Supabase role-based access control for admin users.
- [ ] Secure protected routes in the CMS using Clerk + Supabase roles.

---

## Product & Inventory Flow

### Tasks:

- [ ] Create Supabase `products` table with fields: `id`, `name`, `description`, `price`, `inventory_count`, `stripe_product_id`, `available`.
- [ ] Build CMS UI form to add/edit/delete products.
- [ ] Create Stripe product + pricing via API on Supabase insert.
- [ ] Store returned Stripe product ID into Supabase.
- [ ] Use React Query to fetch `products` for frontend display.
- [ ] Display inventory status and decrement after purchase.

---

## Checkout & Payments

### Tasks:

- [ ] Install and configure Stripe client SDK.
- [ ] Create checkout flow with product, address, and delivery time.
- [ ] Trigger `stripe.checkout.sessions.create` from the client.
- [ ] Listen to `checkout.session.completed` webhook.
- [ ] On webhook event, store order details in Supabase `orders` table.
- [ ] Include delivery time in the order.

---

## Delivery System

### Tasks:

- [ ] Create `delivery_windows` table in Supabase.
- [ ] Allow admin to define delivery slots via CMS.
- [ ] Let users choose a delivery slot during checkout.
- [ ] Save delivery window with order info.
- [ ] Admin UI to view orders per delivery time.
- [ ] Future: implement routing/driver dispatch logic.

---

## CMS Features

### Tasks:

- [ ] Create protected admin routes using Clerk.
- [ ] Implement product CRUD UI.
- [ ] Build dashboard to display all orders.
- [ ] Add UI to update order status (e.g., "Preparing", "Delivered").
- [ ] Create delivery window manager for available time slots.
- [ ] Add filters for viewing orders by status or date.

---

## React Query Strategy

### Tasks:

- [ ] Set up `useQuery` hooks with unique keys (`products`, `orders`, `inventory`).
- [ ] Create mutations (`createOrder`, `updateInventory`, `createProduct`).
- [ ] Add optimistic updates on order placement.
- [ ] Configure `staleTime`, `cacheTime`, and `refetchOnWindowFocus`.

---

## Webhooks & Automation

### Tasks:

- [ ] Write Supabase trigger on `products` to call serverless function that creates Stripe product.
- [ ] Create a webhook handler (API route) for `checkout.session.completed`.
- [ ] On webhook event, validate and store purchase data in `orders`.
- [ ] Sync updated Stripe product details back to Supabase if changed.
- [ ] Notify admins of new orders (optional: email/SMS via Twilio or SendGrid).

---

## Future Features

- [ ] Subscription support via Stripe Billing.
- [ ] Add user delivery tracking interface.
- [ ] Implement delivery route optimization with Mapbox/Google Maps API.
- [ ] Meal recommendations with vector-based food preference matching.

---
