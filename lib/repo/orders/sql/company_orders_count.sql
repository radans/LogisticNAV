SELECT
  COUNT(DISTINCT `orders`.`name`) AS `count`
FROM `orders`
WHERE `orders`.`company` = :companyId
