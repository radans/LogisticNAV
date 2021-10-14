SELECT DISTINCT `email`
FROM `users`
WHERE `users`.`id` IN (:userIds)
ORDER BY `email`;
