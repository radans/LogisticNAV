ALTER TABLE `plans` ADD FOREIGN KEY `foreign_plans_author` (`author_id`)
  REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
