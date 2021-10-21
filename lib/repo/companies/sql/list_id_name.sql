SELECT
  `id` AS `id`,
  CONCAT(`name`, ' ', `contact`) AS `name`
FROM `companies`
ORDER BY `name` ASC
