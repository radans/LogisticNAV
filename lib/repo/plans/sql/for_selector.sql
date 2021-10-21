(
  SELECT
    `plans`.`id` AS `id`,
    `plans`.`name` AS `name`,
    `plans`.`updated_at` AS `updated_at`
  FROM `plans`
  LEFT JOIN `orders` ON (
    `plans`.`id` = `orders`.`plan_id`
  )
  WHERE `orders`.`plan_id` IS NULL
  ORDER BY `updated_at` DESC
  LIMIT 50
)
UNION DISTINCT
(
  SELECT
    `plans`.`id` AS `id`,
    `plans`.`name` AS `name`,
    `plans`.`updated_at` AS `updated_at`
  FROM `plans`
  WHERE `id` = :planId
)
