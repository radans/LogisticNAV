UPDATE `orders` SET
  `vehicle` = :vehicle,
  `unload_date` = :unload_date
WHERE `id` = :orderId
