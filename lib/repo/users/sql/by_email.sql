SELECT
  `users`.`id`,
  `users`.`email`,
  `users`.`phone`,
  `users`.`name`,
  `users`.`help`,
  `users`.`collapsed`,
  `users`.`salt`,
  `users`.`hash`,
  `users`.`active`,
  `users`.`master_user`,
  IFNULL(`users`.`order_email`, '') AS `order_email`,
  `users`.`receive_plan_mails` AS `receive_plan_mails`,
  `users`.`order_mail_copy` AS `order_mail_copy`
FROM `users`
WHERE `users`.`email` = :email
