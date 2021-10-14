SELECT DISTINCT `region`
FROM `addresses`
WHERE `region` IS NOT NULL
  AND `region` <> ''
ORDER BY `region`
