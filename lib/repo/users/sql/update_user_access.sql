UPDATE `users`
SET
  `active` = :active,
  `master_user` = :master_user
WHERE `users`.`id` = :userId
