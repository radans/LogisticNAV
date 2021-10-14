SELECT
  `name`,
  `email`
FROM `users`
WHERE `users`.`receive_plan_mails` = 1
  AND `users`.`active` = 1
