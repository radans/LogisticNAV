SELECT
  `orders`.`id` AS `id`,
  `orders`.`name` AS `name`,
  `orders`.`vehicle` AS `vehicle`,
  `orders`.`loading_date` AS `loading_date`,
  `companies`.`name` AS `company_name`,
  `onload_times`.`times` AS `times_comma`
FROM `orders`
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN (
  SELECT
    GROUP_CONCAT(`time`) AS `times`,
    `order_id`
  FROM `orders_onload`
  GROUP BY `order_id`
) AS `onload_times`
ON (`orders`.`id` = `onload_times`.`order_id`)
ORDER BY `orders`.`id` DESC
LIMIT 200;
