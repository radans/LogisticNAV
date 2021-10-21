SELECT
  `code`,
  `name`,
  `width`,
  `height`,
  `weight`,
  `marker`,
  `double`
FROM `packages`
WHERE `code` LIKE :token
  AND `archived` = 0
ORDER BY `code`
LIMIT 20
