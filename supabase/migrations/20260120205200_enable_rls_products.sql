-- Enable Row Level Security (safe to run again)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (Fixes ERROR: 42710)
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Admin Insert Access" ON products;
DROP POLICY IF EXISTS "Admin Update Access" ON products;
DROP POLICY IF EXISTS "Admin Delete Access" ON products;
DROP POLICY IF EXISTS "Admin Insert" ON products;
DROP POLICY IF EXISTS "Admin Update" ON products;
DROP POLICY IF EXISTS "Admin Delete" ON products;

-- Policy 1: Allow everyone (anon and authenticated) to view products
CREATE POLICY "Public Read Access"
ON products
FOR SELECT
TO public
USING (true);

-- Policy 2: Allow admins to insert products
CREATE POLICY "Admin Insert Access"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Policy 3: Allow admins to update products
CREATE POLICY "Admin Update Access"
ON products
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);

-- Policy 4: Allow admins to delete products
CREATE POLICY "Admin Delete Access"
ON products
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
);
