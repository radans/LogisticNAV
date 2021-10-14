SELECT
  `users`.`id`,
  `users`.`email`,
  `users`.`phone`,
  `users`.`name`,
  `users`.`help`,
  `users`.`collapsed`,
  `users`.`order_email`,
  `users`.`receive_plan_mails`,
  `users`.`order_mail_copy`
FROM `users`
WHERE `users`.`email` IN (:userEmails)
