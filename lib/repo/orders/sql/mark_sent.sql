UPDATE `orders` SET
  `sent_date` = UNIX_TIMESTAMP()
WHERE `id` = :orderId
