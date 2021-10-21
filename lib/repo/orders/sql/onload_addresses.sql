SELECT
  `addresses`.`address` AS `address`,
  `orders_onload`.`time` AS `time`
FROM `orders_onload`
INNER JOIN `addresses` ON (
  `orders_onload`.`address_id` = `addresses`.`id`
)
WHERE `orders_onload`.`order_id` = :orderId
ORDER BY `orders_onload`.`rank` ASC
