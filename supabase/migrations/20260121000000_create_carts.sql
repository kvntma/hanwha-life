-- Create carts table
create table if not exists carts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cart_items table
create table if not exists cart_items (
  id uuid default gen_random_uuid() primary key,
  cart_id uuid references carts(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(cart_id, product_id)
);

-- Enable RLS
alter table carts enable row level security;
alter table cart_items enable row level security;

-- Policies for carts
create policy "Users can view their own cart"
  on carts for select
  using (auth.uid() = user_id);

create policy "Users can create their own cart"
  on carts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart"
  on carts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart"
  on carts for delete
  using (auth.uid() = user_id);

-- Policies for cart_items
-- We allow access if the user owns the parent cart
create policy "Users can view their own cart items"
  on cart_items for select
  using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can insert their own cart items"
  on cart_items for insert
  with check (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can update their own cart items"
  on cart_items for update
  using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

create policy "Users can delete their own cart items"
  on cart_items for delete
  using (
    exists (
      select 1 from carts
      where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
    )
  );

-- Function to handle timestamp updates
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger on_cart_updated
  before update on carts
  for each row execute procedure public.handle_updated_at();

-- Function to update parent cart's updated_at when items change
create or replace function public.handle_cart_updated_at()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    update carts set updated_at = timezone('utc'::text, now()) where id = OLD.cart_id;
  else
    update carts set updated_at = timezone('utc'::text, now()) where id = NEW.cart_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger on_cart_item_change
  after insert or update or delete on cart_items
  for each row execute procedure public.handle_cart_updated_at();
