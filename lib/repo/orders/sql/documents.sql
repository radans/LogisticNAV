SELECT
  `order_documents`.`id` AS `id`,
  `order_documents`.`order_id` AS `order_id`,
  `order_documents`.`original_name` AS `original_name`,
  `order_documents`.`comment` AS `comment`,
  `order_documents`.`upload_date` AS `upload_date`,
  `order_documents`.`generated_id` AS `generated_id`
FROM `order_documents`
WHERE `order_documents`.`order_id` = :orderId
ORDER BY `order_documents`.`original_name` ASC
