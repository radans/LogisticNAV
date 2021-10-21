SELECT
  `addresses`.`id` AS `id`,
  `addresses`.`address` AS `address`,
  `addresses`.`name` AS `name`
FROM `addresses`
INNER JOIN (
  SELECT DISTINCT
    `address_tokens`.`address_id` AS `address_id`
  FROM `address_tokens`
  INNER JOIN `addresses` ON (
    `address_tokens`.`address_id` = `addresses`.`id`
  )
  WHERE `address_tokens`.`token` LIKE :likeToken
    AND `addresses`.`archived` = 0
  LIMIT 10
) AS `found_addresses` ON (
  `found_addresses`.`address_id` = `addresses`.`id`
)
