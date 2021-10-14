ALTER TABLE `orders` ADD FOREIGN KEY `foreign_orders_company` (`company`)
  REFERENCES `companies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `orders` ADD FOREIGN KEY `foreign_orders_plan` (`plan_id`)
  REFERENCES `plans` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `orders` ADD FOREIGN KEY `foreign_orders_author` (`author_id`)
  REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
