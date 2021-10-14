CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_qlik_orders` AS (
  SELECT
    `orders`.`id` AS `id`,
    `orders`.`loading_date` AS `loading_date`,
    FROM_UNIXTIME(`orders`.`created_at`) AS `creating_date`,    
    FROM_UNIXTIME(`orders`.`sent_date`) AS `sending_date`,
    FROM_UNIXTIME(`orders`.`commit_date`) AS `committing_date`,
    `orders`.`country` AS `country`,
    IF(
      `orders`.`import` = 1,
      `onload`.`region`,
      `unload`.`region`
    ) AS `region`,
    `salespeople`.`name` AS `salesperson`,
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
    `orders`.`unload_date` AS `unloading_date`,
    `companies`.`name` AS `company_name`,
    `companies`.`contact` AS `company_contact`,
    `orders`.`vehicle` AS `vehicle`,
    `orders`.`invoice` AS `invoice`,
    `plans`.`name` AS `plan_name`,
    `plan_authors`.`name` AS `plan_author`,
    FROM_UNIXTIME(`plans`.`created_at`) AS `plan_creating_time`,
	IF(
      `plans`.`modified` = 1,
      'Jah',
      'Ei'
    ) AS `plan_modified`,
    `plans`.`modified_text` AS `plan_modified_text`,
    `orders`.`notes` AS `notes`    
  FROM `orders`
  LEFT JOIN `companies`
  ON (`orders`.`company` = `companies`.`id`)
  LEFT JOIN `view_orders_onload` AS `onload`
  ON (`orders`.`id` = `onload`.`order_id`)
  LEFT JOIN `view_orders_unload` AS `unload`
  ON (`orders`.`id` = `unload`.`order_id`)
  LEFT JOIN `salespeople`
  ON (`orders`.`salesperson_id` = `salespeople`.`id`)
  LEFT JOIN `plans`
  ON (`orders`.`plan_id` = `plans`.`id`)
  LEFT JOIN `users` AS `plan_authors`
  ON (`plans`.`author_id` = `plan_authors`.`id`)
  WHERE `orders`.`cancelled` <> 1
);
