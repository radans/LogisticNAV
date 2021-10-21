CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_orders_onload` AS (
  SELECT
    `orders`.`id` AS `order_id`,
    IFNULL(`loading_counts`.`count`, 0) AS `count`,
    `addresses`.`region` AS `region`
  FROM `orders`
  LEFT JOIN (
    SELECT
      COUNT(*) AS `count`,
      MAX(`rank`) AS `max_rank`,
      `orders_onload`.`order_id` AS `order_id`
    FROM `orders_onload`
    GROUP BY `orders_onload`.`order_id`
  ) AS `loading_counts`
  ON (`orders`.`id` = `loading_counts`.`order_id`)
  LEFT JOIN `orders_onload`
  ON (
    `orders`.`id` = `orders_onload`.`order_id`
    AND `loading_counts`.`max_rank` = `orders_onload`.`rank`
  )
  LEFT JOIN `addresses`
  ON (`orders_onload`.`address_id` = `addresses`.`id`)
);

CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_orders_unload` AS (
  SELECT
    `orders`.`id` AS `order_id`,
    IFNULL(`loading_counts`.`count`, 0) AS `count`,
    `addresses`.`region` AS `region`
  FROM `orders`
  LEFT JOIN (
    SELECT
      COUNT(*) AS `count`,
      MAX(`rank`) AS `max_rank`,
      `orders_unload`.`order_id` AS `order_id`
    FROM `orders_unload`
    GROUP BY `orders_unload`.`order_id`
  ) AS `loading_counts`
  ON (`orders`.`id` = `loading_counts`.`order_id`)
  LEFT JOIN `orders_unload`
  ON (
    `orders`.`id` = `orders_unload`.`order_id`
    AND `loading_counts`.`max_rank` = `orders_unload`.`rank`
  )
  LEFT JOIN `addresses`
  ON (`orders_unload`.`address_id` = `addresses`.`id`)
);

CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_qlik_orders` AS (
  SELECT
    `orders`.`id` AS `id`,
    `orders`.`loading_date` AS `loading_date`,
    `orders`.`country` AS `country`,
    IF(
      `orders`.`import` = 1,
      `onload`.`region`,
      `unload`.`region`
    ) AS `region`,
    `orders`.`price` AS `price`,
    IF(
      `orders`.`full_load` = 1,
      'T',
      'O'
    ) AS `full_load`,
    IF(
      `orders`.`import` = 1,
      'Import',
      'Eksport'
    ) AS `import_export`,
    `unload`.`count` AS `unload_count`,
    `companies`.`name` AS `company_name`,
    `orders`.`invoice` AS `invoice`,
    `orders`.`notes` AS `notes`    
  FROM `orders`
  LEFT JOIN `companies`
  ON (`orders`.`company` = `companies`.`id`)
  LEFT JOIN `view_orders_onload` AS `onload`
  ON (`orders`.`id` = `onload`.`order_id`)
  LEFT JOIN `view_orders_unload` AS `unload`
  ON (`orders`.`id` = `unload`.`order_id`)
  WHERE `orders`.`cancelled` <> 1
);
