SELECT
  `users`.`id`,
  `users`.`email`,
  `users`.`phone`,
  `users`.`name`
FROM `users`
WHERE `users`.`active` = 1
ORDER BY `users`.`name`
