SELECT COUNT(*) AS `count`
FROM `orders`
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `plans`
ON (`orders`.`plan_id` = `plans`.`id`)
WHERE (
  `orders`.`id` = :number OR :number IS NULL
) AND (
  `companies`.`name` LIKE :company OR :company IS NULL
) AND (
  `orders`.`name` LIKE :name OR :name IS NULL
) AND (
  `orders`.`country` LIKE :country OR :country IS NULL
) AND (
  `orders`.`notes` LIKE :notes OR :notes IS NULL
) AND (
  `orders`.`vehicle` IS NULL
  OR `orders`.`vehicle` = ''
  OR :uncommitted IS NULL
) AND (
  `orders`.`loading_date` = :date_today
  OR :today IS NULL
) AND (
  `orders`.`loading_date` = :date_tomorrow
  OR :tomorrow IS NULL
) AND (
  ( `orders`.`cancelled` = 0 AND :cancelled IS NULL )
  OR ( `orders`.`cancelled` = 1 AND :cancelled IS NOT NULL )
) AND (
  `orders`.`vehicle` LIKE :vehicle OR :vehicle IS NULL
) AND (
  `orders`.`salesperson_id` = :salesperson_id OR :salesperson_id IS NULL
) AND (
  ( `orders`.`import` = 1 AND :import IS NOT NULL )
  OR :import IS NULL
)
