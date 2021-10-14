SELECT
  `plans`.`id` AS `id`,
  `plans`.`name` AS `name`,
  `plans`.`data_json` AS `data_json`,
  `plans`.`modified` AS `modified`,
  `plans`.`modified_text` AS `modified_text`,
  `orders`.`loading_date` AS `loading_date`,  
  `orders`.`id` AS `order_id`,
  `companies`.`id` AS `company_id`,
  `companies`.`name` AS `company_name`,
  `orders_onload`.`time` AS `loading_time`
FROM `plans`
LEFT JOIN `orders`
ON (`plans`.`id` = `orders`.`plan_id`)
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `orders_onload`
ON (
  `orders`.`id` = `orders_onload`.`order_id`
  AND `orders_onload`.`rank` = 0
)
WHERE `plans`.`id` = :planId
