UPDATE `orders` SET
  `cancelled` = :cancelled,
  `cancel_text` = :cancel_text,
  `cancel_date` = :cancel_date,
  `updated_at` = UNIX_TIMESTAMP()
WHERE `id` = :orderId
