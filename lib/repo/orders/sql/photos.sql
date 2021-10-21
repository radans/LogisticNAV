SELECT
  `id` AS `id`,
  `generated_id` AS `generated_id`
FROM `photos`
WHERE `order_id` = :orderId
ORDER BY `generated_id`
