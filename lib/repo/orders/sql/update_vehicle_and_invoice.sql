UPDATE `orders` SET
  `vehicle` = :vehicle,
  `invoice` = :invoice,
  `updated_at` = UNIX_TIMESTAMP(),
  `unload_date` = :unload_date,
  `plan_id` = :planId,
  `salesperson_id` = :salespersonId,
  `unload_date` = :unload_date
WHERE `id` = :orderId
