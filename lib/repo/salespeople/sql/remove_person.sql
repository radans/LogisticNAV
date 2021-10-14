UPDATE `orders`
SET `salesperson_id` = NULL
WHERE `salesperson_id` = :personId;
DELETE FROM `salespeople_users`
WHERE `salesperson_id` = :personId;
DELETE FROM `salespeople`
WHERE `id` = :personId;
