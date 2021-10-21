ALTER TABLE `orders` ADD COLUMN `client_transport` TINYINT(1) NOT NULL DEFAULT 0;
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
    IF(
      `orders`.`client_transport` = 1,
      'Jah',
      'Ei'
    ) AS `client_transport`,
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
