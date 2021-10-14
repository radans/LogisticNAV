ALTER TABLE `orders_unload` ADD COLUMN `unload_date` DATE DEFAULT NULL;
UPDATE `orders_unload`
SET `orders_unload`.`unload_date` = (
  SELECT `orders`.`unload_date`
  FROM `orders`
  WHERE `orders`.`id` = `orders_unload`.`order_id`
);
