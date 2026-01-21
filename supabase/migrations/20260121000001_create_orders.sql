-- Create orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  full_name text not null,
  address text not null,
  phone text not null,
  delivery_window text not null,
  total_amount decimal(10,2) not null,
  status text not null default 'pending_payment',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies for orders
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Admins can view and update all orders
create policy "Admins can view all orders"
  on orders for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (
        (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        OR 
        (auth.users.raw_user_meta_data->>'is_admin') = 'true'
      )
    )
  );

create policy "Admins can update orders"
  on orders for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (
        (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        OR 
        (auth.users.raw_user_meta_data->>'is_admin') = 'true'
      )
    )
  );

-- Policies for order_items
create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert their own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
create policy "Admins can view all order items"
  on order_items for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and (
        (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        OR 
        (auth.users.raw_user_meta_data->>'is_admin') = 'true'
      )
    )
  );

-- Trigger for updated_at
create trigger on_order_updated
  before update on orders
  for each row execute procedure public.handle_updated_at();
