SELECT
  `orders`.`id` AS `id`,
  `orders`.`name` AS `order_name`,
  `orders`.`loading_date` AS `loading_date`,
  `orders`.`info` AS `info`,
  `orders`.`notes` AS `notes`,
  `orders`.`vehicle` AS `vehicle`,
  `orders`.`price` AS `price`,
  `orders`.`country` AS `country`,
  `orders`.`invoice` AS `invoice`,
  `orders`.`cancelled` AS `cancelled`,
  `orders`.`sent_date` AS `sent_date`,
  `orders`.`unload_date` AS `unload_date`,
  `orders`.`salesperson_id` AS `salesperson_id`,
  `orders`.`client_transport` AS `client_transport`,
  `companies`.`id` AS `company_id`,
  `companies`.`name` AS `company_name`,
  `companies`.`contact` AS `contact`,
  `companies`.`email` AS `email`,
  `companies`.`address` AS `address`,
  `companies`.`phone` AS `phone`,
  `orders`.`plan_id` AS `plan_id`,
  `orders`.`full_load` AS `full_load`,
  `plans`.`name` AS `plan_name`,
  `orders_unload`.`count` AS `unloading_count`,
  `orders_unload`.`region` AS `unloading_region`,
  IFNULL(`order_document_counts`.`count`, 0) AS `document_count`
FROM `orders`
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `plans`
ON (`orders`.`plan_id` = `plans`.`id`)
LEFT JOIN `view_orders_unload` AS `orders_unload`
ON (`orders`.`id` = `orders_unload`.`order_id`)
LEFT JOIN (
  SELECT
    COUNT(*) AS `count`,
    `order_documents`.`order_id` AS `order_id`
  FROM `order_documents`
  GROUP BY `order_documents`.`order_id`
) AS `order_document_counts`
ON (`orders`.`id` = `order_document_counts`.`order_id`)
WHERE (
  `orders`.`id` = :number OR :number IS NULL
) AND (
  `companies`.`name` LIKE :company OR :company IS NULL
) AND (
  `orders`.`name` LIKE :name OR :name IS NULL
) AND (
  `orders`.`country` LIKE :country OR :country IS NULL
) AND (
  `orders`.`notes` LIKE :notes OR :notes IS NULL
) AND (
  `orders`.`vehicle` IS NULL
  OR `orders`.`vehicle` = ''
  OR :uncommitted IS NULL
) AND (
  `orders`.`loading_date` = :date_today
  OR :today IS NULL
) AND (
  `orders`.`loading_date` = :date_tomorrow
  OR :tomorrow IS NULL
) AND (
  ( `orders`.`cancelled` = 0 AND :cancelled IS NULL )
  OR ( `orders`.`cancelled` = 1 AND :cancelled IS NOT NULL )
) AND (
  `orders`.`vehicle` LIKE :vehicle OR :vehicle IS NULL
) AND (
  `orders`.`salesperson_id` = :salesperson_id OR :salesperson_id IS NULL
) AND (
  ( `orders`.`import` = 1 AND :import IS NOT NULL )
  OR :import IS NULL
)
ORDER BY ?order ORDER_DIRECTION
LIMIT :limit OFFSET :offset
