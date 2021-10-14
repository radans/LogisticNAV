UPDATE `orders` SET
  `commit_date` = :commit_date
WHERE `id` = :orderId
