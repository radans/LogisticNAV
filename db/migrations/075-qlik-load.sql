CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_qlik_onload` AS (
  SELECT
    `orders_onload`.`order_id` AS `order_id`,
    `orders_onload`.`rank` AS `rank`,
    `orders_onload`.`address_id` AS `address_id`,
    `orders_onload`.`time` AS `time`
  FROM `orders_onload`
);

CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_qlik_unload` AS (
  SELECT
    `orders_unload`.`order_id` AS `order_id`,
    `orders_unload`.`rank` AS `rank`,
    `orders_unload`.`address_id` AS `address_id`
  FROM `orders_unload`
);
