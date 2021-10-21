UPDATE `orders`
  SET `plan_id` = NULL
WHERE `plan_id` = :planId;
UPDATE `orders`
  SET `plan_id` = :planId
WHERE `id` = :orderId
