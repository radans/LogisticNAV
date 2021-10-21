SELECT
  `orders`.`id` AS `id`,
  IFNULL(`orders`.`price`, 0) AS `price`,
  `orders`.`country` AS `country`,  
  `orders`.`invoice` AS `invoice`,
  `orders`.`loading_date` AS `loading_date`,
  `orders`.`created_at` AS `created_at`,
  `orders`.`full_load` AS `full_load`,
  `orders`.`notes` AS `notes`,
  `orders`.`import` AS `import`,
  `orders`.`client_transport` AS `client_transport`,
  `companies`.`name` AS `company_name`,
  IF(
    `orders`.`import` = 1,
    `onload`.`region`,
    `unload`.`region`
  ) AS `region`,
  `unload`.`count` AS `unloading_count`
FROM `orders`
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `view_orders_onload` AS `onload`
ON (`orders`.`id` = `onload`.`order_id`)
LEFT JOIN `view_orders_unload` AS `unload`
ON (`orders`.`id` = `unload`.`order_id`)
WHERE `orders`.`loading_date` >= :start
  AND `orders`.`loading_date` <= :end
  AND `orders`.`cancelled` <> 1
  AND (`orders`.`company` IN (:companies) OR 0 IN (:companies))
  AND (`orders`.`country` = :country OR :country IS NULL)
  AND (
    `onload`.`region` = :region
    OR `unload`.`region` = :region
    OR :region IS NULL
  )
  AND (`orders`.`salesperson_id` = :salesperson OR :salesperson IS NULL)
  AND (
    ( `orders`.`import` = 0 AND :importExport = 1 )
    OR ( `orders`.`import` = 1 AND :importExport = 2 )
    OR ( :importExport = 0 )
  )
  AND (
    ( `orders`.`client_transport` = 0 AND :clientTransport = 1 )
    OR ( `orders`.`client_transport` = 1 AND :clientTransport = 2 )
    OR ( :clientTransport = 0 )
  )
ORDER BY `orders`.`id` DESC
