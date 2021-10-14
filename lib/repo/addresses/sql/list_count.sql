SELECT COUNT(*) AS `count`
FROM `addresses`
WHERE (
  :search IS NULL
  OR `addresses`.`name` LIKE :search
  OR `addresses`.`address` LIKE :search
  OR `addresses`.`notes` LIKE :search
  OR `addresses`.`region` LIKE :search
  OR `addresses`.`marker` LIKE :search
) AND (
  (:archived IS NULL AND `addresses`.`archived` = 0)
  OR (:archived IS NOT NULL AND `addresses`.`archived` = 1)
)
