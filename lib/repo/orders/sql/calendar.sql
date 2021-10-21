SELECT
  `orders`.`id`,
  `orders`.`company` AS `company_id`,
  `orders`.`name` AS `order_name`,
  `orders`.`loading_date` AS `loading_date`,
  `orders`.`price` AS `price`,
  `orders`.`vehicle` AS `vehicle`,
  `orders`.`price` AS `price`,
  `orders`.`plan_id` AS `plan_id`,
  IFNULL(
    `orders`.`unload_date`,
    `orders_unload`.`unload_date`
  ) AS `unload_date`,
  `orders`.`salesperson_id` AS `salesperson_id`,
  `orders`.`full_load` AS `full_load`,
  `companies`.`name` AS `company_name`,
  `salespeople`.`name` AS `salesperson_name`,
  `onload_counts`.`count` AS `onload_count`,
  `orders_onload`.`time` AS `loading_time`,
  `onload_times`.`times` AS `times_comma`,
  `addresses`.`marker` AS `loading_marker`,
  `plans`.`modified` AS `plan_modified`,
  `plans`.`modified_text` AS `plan_modified_text`
FROM `orders`
LEFT JOIN `companies`
ON (`orders`.`company` = `companies`.`id`)
LEFT JOIN `plans`
ON (`orders`.`plan_id` = `plans`.`id`)
LEFT JOIN `salespeople`
ON (`orders`.`salesperson_id` = `salespeople`.`id`)
LEFT JOIN (
  SELECT
    COUNT(*) AS `count`,
    `order_id`
  FROM `orders_onload`
  GROUP BY `order_id`
) AS `onload_counts`
ON (`orders`.`id` = `onload_counts`.`order_id`)
LEFT JOIN `orders_onload`
ON (
  `orders`.`id` = `orders_onload`.`order_id`
  AND `orders_onload`.`rank` = 0
)
LEFT JOIN (
  SELECT
    GROUP_CONCAT(`time`) AS `times`,
    `order_id`
  FROM `orders_onload`
  GROUP BY `order_id`
) AS `onload_times`
ON (`orders`.`id` = `onload_times`.`order_id`)
LEFT JOIN `addresses`
ON (`orders_onload`.`address_id` = `addresses`.`id`)
LEFT JOIN `orders_unload`
ON (
  `orders_unload`.`order_id` = `orders`.`id`
  AND `orders_unload`.`rank` = 0
)
WHERE `orders`.`loading_date` >= :start
  AND `orders`.`loading_date` < :end
  AND `orders`.`cancelled` = 0
  AND EXISTS (
    SELECT * FROM `orders_onload`
    LEFT JOIN `addresses` ON (
      `orders_onload`.`address_id` = `addresses`.`id`
    )
    WHERE `orders_onload`.`order_id` = `orders`.`id`
      AND (
        (
          `addresses`.`region` = 'EE'
          AND :location = 'estonia'
        )
        OR (
          (
            `addresses`.`region` <> 'EE'
            OR `addresses`.`region` IS NULL
          )
          AND :location = 'foreign'
        )
        OR :location = 'all'
      )
  )
