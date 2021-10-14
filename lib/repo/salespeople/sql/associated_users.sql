SELECT
  `salespeople_users`.`salesperson_id`,
  `salespeople_users`.`user_id`,
  `users`.`name` AS `user_name`,
  `users`.`email` AS `user_email`
FROM `salespeople_users`
INNER JOIN `users` ON (
    `salespeople_users`.`user_id` = `users`.`id`
)
ORDER BY `users`.`name`
