SELECT COUNT(*) AS `count`
FROM `plans`
WHERE (
  `plans`.`author_id` = :author_id
  OR :author_id = 0
) AND (
  :package_code IS NULL OR EXISTS (
    SELECT * FROM `plan_packages`
    WHERE `plan_packages`.`plan_id` = `plans`.`id`
      AND `plan_packages`.`package_code` = :package_code
  )
)
