SELECT
  `users`.`id`,
  `users`.`email`,
  `users`.`phone`,
  `users`.`name`
FROM `users`
WHERE EXISTS (
  SELECT * FROM `plans` WHERE `plans`.`author_id` = `users`.`id`
)
AND `users`.`active` = 1
ORDER BY `users`.`name`
