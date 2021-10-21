CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_qlik_unload` AS (
  SELECT
    `orders_unload`.`order_id` AS `order_id`,
    `orders_unload`.`rank` AS `rank`,
    `orders_unload`.`address_id` AS `address_id`,
    `orders_unload`.`unload_date` AS `unload_date`
  FROM `orders_unload`
);
