INSERT INTO `salespeople_users` (`salesperson_id`, `user_id`)
VALUES :values ON DUPLICATE KEY UPDATE `user_id` = VALUES(`user_id`)
