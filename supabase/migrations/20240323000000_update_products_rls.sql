-- Drop existing policies if they exist
drop policy if exists "Allow public read access to available products" on products;
drop policy if exists "Allow authenticated users to read all products" on products;
drop policy if exists "Allow admin users to manage products" on products;

-- Enable RLS
alter table products enable row level security;

-- Allow anyone to read products
create policy "Allow public read access to products"
  on products for select
  using (true);

-- Allow admins to manage products (create, update, delete)
create policy "Allow admin users to manage products"
  on products for all
  to authenticated
  using (
    auth.jwt() ->> 'aud' = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true
  )
  with check (
    auth.jwt() ->> 'aud' = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true
  );

-- Create a function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return auth.jwt() ->> 'aud' = 'authenticated' AND
         (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true;
end;
$$ language plpgsql security definer; 