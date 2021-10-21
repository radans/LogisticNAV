SELECT DISTINCT `country`
FROM `orders`
WHERE `country` IS NOT NULL
  AND `country` <> ''
ORDER BY `country`
