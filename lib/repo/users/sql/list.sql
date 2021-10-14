SELECT
  `users`.`id` AS `id`,
  `users`.`name` AS `name`,
  `users`.`email` AS `email`,
  `users`.`phone` AS `phone`,
  `users`.`active` AS `active`,
  `users`.`master_user` AS `master_user`
FROM `users`
ORDER BY ?order ORDER_DIRECTION
LIMIT :limit OFFSET :offset
