
-- Add e-transfer reference column to orders
alter table orders add column if not exists etransfer_reference text;

-- Update the admin view policy to ensure it's still consistent (though alter doesn't affect policies usually)
-- No changes needed to RLS.
