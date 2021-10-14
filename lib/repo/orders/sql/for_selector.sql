(
  SELECT
    `id`,
    `name`,
    `updated_at`,
    `created_at`,
    `loading_date`
  FROM `orders`
  WHERE `plan_id` IS NULL
    AND `cancelled` = 0
  ORDER BY `loading_date` DESC
  LIMIT 50
)
UNION DISTINCT
(
  SELECT
    `id`,
    `name`,
    `updated_at`,
    `created_at`,
    `loading_date`
  FROM `orders`
  WHERE `plan_id` = :planId
)
