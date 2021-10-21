SELECT
  `addresses`.`address` AS `address`,
  `orders_unload`.`unload_date` AS `date`,
  `orders_unload`.`time` AS `time`
FROM `orders_unload`
INNER JOIN `addresses` ON (
  `orders_unload`.`address_id` = `addresses`.`id`
)
WHERE `orders_unload`.`order_id` = :orderId
ORDER BY `orders_unload`.`rank` ASC
