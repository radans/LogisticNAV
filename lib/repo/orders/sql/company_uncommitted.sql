SELECT
  `orders`.`id` AS `order_id`,
  `orders`.`name` AS `order_name`,
  `orders`.`loading_date` AS `loading_date`
FROM `orders`
WHERE `orders`.`company` = :companyId
  AND (
    `orders`.`vehicle` IS NULL
    OR `orders`.`vehicle` = ''
  )
ORDER BY `orders`.`loading_date` DESC
