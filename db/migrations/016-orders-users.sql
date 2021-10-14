CREATE INDEX index_orders_loading_date ON orders (loading_date);
DROP INDEX inder_users_email ON users;
CREATE UNIQUE INDEX index_users_email ON users (email);
