SELECT
  GROUP_CONCAT(`id`) AS `ids`,
  `name` AS `name`
FROM `companies`
GROUP BY `name`
ORDER BY `name` ASC
