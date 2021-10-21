SELECT
  `orders`.`id` AS `id`,
  `orders`.`name` AS `order_name`,
  `orders`.`loading_date` AS `loading_date`,
  `orders`.`info` AS `info`,
  `orders`.`notes` AS `notes`,
  `orders`.`vehicle` AS `vehicle`,
  `orders`.`price` AS `price`,
  `orders`.`country` AS `country`,
  `orders`.`created_at` AS `created_at`,
  `orders`.`updated_at` AS `updated_at`,
  `orders`.`author_id` AS `author_id`,
  `orders`.`plan_id` AS `plan_id`,
  `orders`.`invoice` AS `invoice`,
  `orders`.`cancelled` AS `cancelled`,
  `orders`.`cancel_text` AS `cancel_text`,
  `orders`.`cancel_date` AS `cancel_date`,
  `orders`.`commit_date` AS `commit_date`,
  `orders`.`unload_date` AS `unload_date`,
  `orders`.`sent_date` AS `sent_date`,
  `orders`.`salesperson_id` AS `salesperson_id`,
  `orders`.`full_load` AS `full_load`,
  `orders`.`import` AS `import`,
  `orders`.`client_transport` AS `client_transport`,
  `companies`.`id` AS `company_id`,
  `companies`.`name` AS `company_name`,
  `companies`.`contact` AS `contact`,
  `companies`.`email` AS `email`,
  `companies`.`address` AS `address`,
  `companies`.`phone` AS `phone`,
  `users`.`email` AS `author_email`,
  `users`.`phone` AS `author_phone`,
  `users`.`name` AS `author_name`,
  `users`.`order_email` AS `user_order_email`,
  `plans`.`name` AS `plan_name`,
  `salespeople`.`name` AS `salesperson_name`
FROM `orders`
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `users`
ON (`orders`.`author_id` = `users`.`id`)
LEFT JOIN `plans`
ON (`orders`.`plan_id` = `plans`.`id`)
LEFT JOIN `salespeople`
ON (`orders`.`salesperson_id` = `salespeople`.`id`)
WHERE `orders`.`id` = :orderId
