SELECT
  COUNT(*) AS `count`
FROM `settings`
WHERE `settings`.`value` IS NULL
