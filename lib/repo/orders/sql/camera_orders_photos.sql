SELECT
  `orders_limit`.`id` AS `order_id`,
  `photos`.`generated_id` AS `generated_id`
FROM (
  SELECT
    `orders`.`id` AS `id`
  FROM `orders`
  ORDER BY `orders`.`id` DESC
  LIMIT 50
) `orders_limit`
INNER JOIN `photos`
ON ( `orders_limit`.`id` = `photos`.`order_id` )
