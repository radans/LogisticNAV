SELECT
  `plans`.`id` AS `id`,
  `plans`.`name` AS `name`,
  `plans`.`author_id` AS `author_id`,
  `plans`.`created_at` AS `created_at`,
  `plans`.`updated_at` AS `updated_at`,
  `plans`.`modified` AS `modified`,
  `plans`.`modified_text` AS `modified_text`,
  `plans`.`sent_at` AS `sent_at`,
  `users`.`name` AS `author_name`,
  `orders`.`id` AS `order_id`,
  `orders`.`salesperson_id` AS `salesperson_id`,
  `orders`.`loading_date` AS `loading_date`,
  `companies`.`id` AS `company_id`,
  `companies`.`name` AS `company_name`,
  `orders_onload`.`time` AS `loading_time`
FROM `plans`
LEFT JOIN `users`
ON ( `plans`.`author_id` = `users`.`id` )
LEFT JOIN `orders`
ON ( `plans`.`id` = `orders`.`plan_id` )
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `orders_onload`
ON (
  `orders`.`id` = `orders_onload`.`order_id`
  AND `orders_onload`.`rank` = 0
)
WHERE (
  `plans`.`author_id` = :author_id
  OR :author_id = 0
) AND (
  :package_code IS NULL OR EXISTS (
    SELECT * FROM `plan_packages`
    WHERE `plan_packages`.`plan_id` = `plans`.`id`
      AND `plan_packages`.`package_code` = :package_code
  )
)
ORDER BY ?order ORDER_DIRECTION
LIMIT :limit OFFSET :offset
