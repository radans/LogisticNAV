SELECT
  `users`.`id` AS `id`
FROM `users`
WHERE `users`.`master_user` = 1;
