UPDATE `orders` SET
  `unload_date` = (
    SELECT MIN(`unload_date`)
    FROM `orders_unload`
    WHERE `order_id` = :orderId
      AND `unload_date` IS NOT NULL
  )
WHERE `id` = :orderId
