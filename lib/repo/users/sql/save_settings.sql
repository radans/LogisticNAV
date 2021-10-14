UPDATE `users` SET
  `name` = :name,
  `phone` = :phone,
  `help` = :help,
  `order_email` = :order_email,
  `receive_plan_mails` = :receive_plan_mails,
  `order_mail_copy` = :order_mail_copy
WHERE `email` = :email
