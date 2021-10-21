ALTER TABLE `salespeople` ADD COLUMN `user_id` INTEGER DEFAULT NULL;
ALTER TABLE `salespeople` ADD FOREIGN KEY `foreign_salespeople_user` (`user_id`)
  REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
