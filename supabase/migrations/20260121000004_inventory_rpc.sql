
-- Function to safely decrement inventory
create or replace function decrement_inventory(product_id uuid, qty int)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set inventory_count = inventory_count - qty
  where id = product_id
  and inventory_count >= qty;

  if not found then
    raise exception 'Insufficient inventory for product %', product_id;
  end if;
end;
$$;
