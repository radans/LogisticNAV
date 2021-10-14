SELECT COUNT(*) AS `count`
FROM `packages`
WHERE (`packages`.`code` LIKE :code OR :code IS NULL)
  AND (`packages`.`name` LIKE :name OR :name IS NULL)
  AND (
    ( `packages`.`archived` = 0 AND :archived IS NULL )
    OR ( `packages`.`archived` = 1 AND :archived IS NOT NULL )
  )
  