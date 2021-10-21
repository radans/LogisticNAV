SELECT
  `addresses`.`id` AS `id`,
  `addresses`.`name` AS `name`,
  `addresses`.`notes` AS `notes`,
  `addresses`.`address` AS `address`,
  `addresses`.`archived` AS `archived`,
  `addresses`.`region` AS `region`,
  `addresses`.`marker` AS `marker`
FROM `addresses`
WHERE `addresses`.`id` = :addressId
