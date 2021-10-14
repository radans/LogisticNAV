SELECT
  `packages`.`code` AS `code`,
  `packages`.`name` AS `name`,
  `packages`.`width` AS `width`,
  `packages`.`height` AS `height`,
  `packages`.`double` AS `double`,
  `packages`.`archived` AS `archived`,
  `packages`.`weight` AS `weight`,
  `packages`.`marker` AS `marker`
FROM `packages`
WHERE (`packages`.`code` LIKE :code OR :code IS NULL)
  AND (`packages`.`name` LIKE :name OR :name IS NULL)
  AND (
    ( `packages`.`archived` = 0 AND :archived IS NULL )
    OR ( `packages`.`archived` = 1 AND :archived IS NOT NULL )
  )
ORDER BY ?order ORDER_DIRECTION
LIMIT :limit OFFSET :offset
