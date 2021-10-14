INSERT INTO `salespeople_users` (`salesperson_id`, `user_id`)
SELECT `salespeople`.`id`, `salespeople`.`user_id` FROM `salespeople`
WHERE `salespeople`.`user_id` IS NOT NULL
