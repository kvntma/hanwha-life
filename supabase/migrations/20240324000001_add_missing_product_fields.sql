-- Add new columns to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS weight text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text;

-- Update existing products with the new fields
UPDATE products
SET 
  tagline = CASE name
    WHEN 'The Shredder' THEN 'Lean machine fuel'
    WHEN 'No Moo Monday' THEN 'Plant power perfection'
    WHEN 'Bulking Beast' THEN 'Mass gaining monster'
    WHEN 'Teriyaki Titan' THEN 'Asian-fusion gains'
    WHEN 'Keto Konquest' THEN 'Low carb, high flavor'
    WHEN 'Beefy Boy' THEN 'Serious gains fuel'
    WHEN 'Green Gains' THEN 'Plant-powered pump'
    WHEN 'Spicy Gainz' THEN 'Heat up your metabolism'
  END,
  weight = CASE name
    WHEN 'The Shredder' THEN '12 oz'
    WHEN 'No Moo Monday' THEN '11 oz'
    WHEN 'Bulking Beast' THEN '14 oz'
    WHEN 'Teriyaki Titan' THEN '12 oz'
    WHEN 'Keto Konquest' THEN '11 oz'
    WHEN 'Beefy Boy' THEN '13 oz'
    WHEN 'Green Gains' THEN '12 oz'
    WHEN 'Spicy Gainz' THEN '12 oz'
  END,
  featured = CASE name
    WHEN 'The Shredder' THEN true
    WHEN 'No Moo Monday' THEN true
    WHEN 'Keto Konquest' THEN true
    ELSE false
  END,
  category = CASE name
    WHEN 'The Shredder' THEN 'Bestseller'
    WHEN 'No Moo Monday' THEN 'Plant-Based'
    WHEN 'Bulking Beast' THEN 'High Calorie'
    WHEN 'Teriyaki Titan' THEN 'International'
    WHEN 'Keto Konquest' THEN 'Keto'
    WHEN 'Beefy Boy' THEN 'Bestseller'
    WHEN 'Green Gains' THEN 'Plant-Based'
    WHEN 'Spicy Gainz' THEN 'Spicy'
  END; 