-- Reduce default free credits from 20 to 10 per new signup
-- Cuts acquisition cost by 50% while still giving enough credits to evaluate the product
ALTER TABLE studios ALTER COLUMN credits SET DEFAULT 10;
