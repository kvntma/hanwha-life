-- Drop existing policies
drop policy if exists "Allow public read access to available products" on products;
drop policy if exists "Allow authenticated users to read all products" on products;
drop policy if exists "Allow admin users to manage products" on products;

-- Create new policies with role-based access
create policy "Allow public read access to available products"
  on products for select
  using (available = true);

create policy "Allow authenticated users to read all products"
  on products for select
  to authenticated
  using (true);

create policy "Allow admin users to manage products"
  on products for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Create a function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return auth.jwt() ->> 'role' = 'admin';
end;
$$ language plpgsql security definer; 