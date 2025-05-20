-- Create products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null check (price >= 0),
  inventory_count integer not null default 0 check (inventory_count >= 0),
  stripe_product_id text,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

-- Create RLS policies
alter table products enable row level security;

-- Allow public read access to available products
create policy "Allow public read access to available products"
  on products for select
  using (available = true);

-- Allow authenticated users to read all products
create policy "Allow authenticated users to read all products"
  on products for select
  to authenticated
  using (true);

-- Allow admin users to manage products
create policy "Allow admin users to manage products"
  on products for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin'); 