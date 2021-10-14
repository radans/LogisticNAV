ALTER TABLE `orders` ADD COLUMN `salesperson_id` INTEGER DEFAULT NULL;
ALTER TABLE `orders` ADD FOREIGN KEY `foreign_orders_salespeople` (`salesperson_id`)
  REFERENCES `salespeople` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
