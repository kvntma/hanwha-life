-- Add nutrition column to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS nutrition jsonb;

-- Update products with nutrition data
UPDATE products
SET nutrition = CASE name
  WHEN 'The Shredder' THEN '{"calories": 450, "protein": 45, "carbs": 35, "fat": 12}'::jsonb
  WHEN 'No Moo Monday' THEN '{"calories": 380, "protein": 20, "carbs": 45, "fat": 15}'::jsonb
  WHEN 'Bulking Beast' THEN '{"calories": 650, "protein": 50, "carbs": 55, "fat": 25}'::jsonb
  WHEN 'Teriyaki Titan' THEN '{"calories": 520, "protein": 40, "carbs": 50, "fat": 18}'::jsonb
  WHEN 'Keto Konquest' THEN '{"calories": 420, "protein": 35, "carbs": 10, "fat": 28}'::jsonb
  WHEN 'Beefy Boy' THEN '{"calories": 580, "protein": 45, "carbs": 40, "fat": 30}'::jsonb
  WHEN 'Green Gains' THEN '{"calories": 400, "protein": 25, "carbs": 45, "fat": 15}'::jsonb
  WHEN 'Spicy Gainz' THEN '{"calories": 480, "protein": 38, "carbs": 45, "fat": 20}'::jsonb
END; 