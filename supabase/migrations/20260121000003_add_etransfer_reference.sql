-- Add etransfer_reference column to orders table
alter table orders add column if not exists etransfer_reference text;
