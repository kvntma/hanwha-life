-- Create admin_notifications table
create table if not exists admin_notifications (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'new_order', 'etransfer_reference_submitted', 'order_status_change'
  title text not null,
  message text not null,
  order_id uuid references orders(id) on delete cascade,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table admin_notifications enable row level security;

-- Only admins can view notifications
create policy "Admins can view all notifications"
  on admin_notifications for select
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

-- Admins can mark notifications as read
create policy "Admins can update notifications"
  on admin_notifications for update
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

-- Function to create notification when new order is placed
create or replace function notify_admin_new_order()
returns trigger as $$
begin
  insert into admin_notifications (type, title, message, order_id)
  values (
    'new_order',
    'New Order Placed',
    'Order #' || substring(NEW.id::text, 1, 8) || ' - $' || NEW.total_amount || ' from ' || NEW.full_name,
    NEW.id
  );
  return NEW;
end;
$$ language plpgsql;

-- Trigger for new orders
create trigger on_new_order_notify_admin
  after insert on orders
  for each row
  execute function notify_admin_new_order();

-- Function to create notification when e-transfer reference is submitted
create or replace function notify_admin_etransfer_reference()
returns trigger as $$
begin
  -- Only notify if etransfer_reference was just added (changed from null to a value)
  if OLD.etransfer_reference is null and NEW.etransfer_reference is not null then
    insert into admin_notifications (type, title, message, order_id)
    values (
      'etransfer_reference_submitted',
      'E-Transfer Reference Submitted',
      'Order #' || substring(NEW.id::text, 1, 8) || ' - Reference: ' || NEW.etransfer_reference,
      NEW.id
    );
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Trigger for e-transfer reference submission
create trigger on_etransfer_reference_notify_admin
  after update on orders
  for each row
  when (OLD.etransfer_reference is distinct from NEW.etransfer_reference)
  execute function notify_admin_etransfer_reference();
