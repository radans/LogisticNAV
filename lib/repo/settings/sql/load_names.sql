SELECT
  `settings`.`name` AS `name`,
  `settings`.`value` AS `value`
FROM `settings`
WHERE `name` IN (:names)
