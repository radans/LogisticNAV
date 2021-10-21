SELECT  
  `latest_orders`.`order_name` AS `order_name`,
  `orders`.`loading_date` AS `loading_date`,
  `orders`.`id` AS `order_id`
FROM (
  SELECT
    MAX(`orders`.`id`) AS `order_id`,
    `orders`.`name` AS `order_name`
  FROM `orders`
  WHERE `orders`.`company` = :companyId
  GROUP BY `orders`.`name`
) AS `latest_orders`
INNER JOIN `orders` ON (
  `latest_orders`.`order_id` = `orders`.`id`
  AND `orders`.`company` = :companyId
)
ORDER BY ?order ORDER_DIRECTION
LIMIT :limit OFFSET :offset
