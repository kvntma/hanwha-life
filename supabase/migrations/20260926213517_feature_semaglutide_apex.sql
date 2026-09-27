-- Feature all three homepage products and repair the unavailable BPC-157 image.
UPDATE products
SET
  featured = true,
  image = CASE
    WHEN id = '637bcbe3-f000-4ff2-b8c2-43db66b3f720'
      THEN 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=2070&auto=format&fit=crop'
    ELSE image
  END
WHERE id IN (
  '637bcbe3-f000-4ff2-b8c2-43db66b3f720',
  'ae7cbe2e-871f-44ca-8fb8-76b1d744f224'
);
