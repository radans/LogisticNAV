SELECT
  `companies`.`id` AS `id`,
  `companies`.`name` AS `name`,
  `companies`.`contact` AS `contact`,
  `companies`.`email` AS `email`,
  `companies`.`address` AS `address`,
  `companies`.`phone` AS `phone`,
  `last_orders`.`loading_date` AS `last_loading_date`
FROM `companies`
LEFT JOIN (
  SELECT
    MAX(`loading_date`) AS `loading_date`,
    `company` AS `company`
  FROM `orders`
  GROUP BY `company`
) AS `last_orders` ON (
  `companies`.`id` = `last_orders`.`company`
)
ORDER BY ?order ORDER_DIRECTION
LIMIT :limit OFFSET :offset
