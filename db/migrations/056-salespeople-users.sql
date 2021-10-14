CREATE TABLE `salespeople_users` (
  `salesperson_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  PRIMARY KEY (`salesperson_id`, `user_id`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `salespeople_users` ADD FOREIGN KEY `foreign_salespeople_users_salespeople` (`salesperson_id`)
  REFERENCES `salespeople` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `salespeople_users` ADD FOREIGN KEY `foreign_salespeople_users_users` (`user_id`)
  REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
