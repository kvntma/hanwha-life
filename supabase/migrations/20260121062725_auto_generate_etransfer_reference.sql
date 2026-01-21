-- Create function to generate unique etransfer reference
create or replace function generate_etransfer_reference()
returns text
language plpgsql
as $$
declare
  ref_code text;
  ref_exists boolean;
begin
  loop
    -- Generate a random 8-character alphanumeric code (uppercase)
    ref_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if this reference already exists
    select exists(
      select 1 from orders where etransfer_reference = ref_code
    ) into ref_exists;
    
    -- If it doesn't exist, we can use it
    exit when not ref_exists;
  end loop;
  
  return ref_code;
end;
$$;

-- Create trigger function to auto-generate etransfer_reference on insert
create or replace function set_etransfer_reference()
returns trigger
language plpgsql
as $$
begin
  -- Only generate if etransfer_reference is null
  if NEW.etransfer_reference is null then
    NEW.etransfer_reference := generate_etransfer_reference();
  end if;
  
  return NEW;
end;
$$;

-- Create trigger to auto-generate etransfer_reference before insert
drop trigger if exists auto_generate_etransfer_reference on orders;
create trigger auto_generate_etransfer_reference
  before insert on orders
  for each row
  execute function set_etransfer_reference();

-- Update existing orders that have null etransfer_reference
update orders
set etransfer_reference = generate_etransfer_reference()
where etransfer_reference is null;
