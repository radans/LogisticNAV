UPDATE `orders`
  SET `plan_id` = NULL
WHERE `plan_id` = :planId
