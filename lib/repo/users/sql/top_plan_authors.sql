SELECT
  `users`.`name`,
  `users`.`id`
FROM `users`
INNER JOIN (
  SELECT
    COUNT(*) AS `count`,
    `plans`.`author_id` AS `author_id`
  FROM `plans`
  GROUP BY `author_id`  
) `plan_counts`
ON (`users`.`id` = `plan_counts`.`author_id`)
WHERE `users`.`active` = 1
ORDER BY `plan_counts`.`count` DESC
LIMIT 2
