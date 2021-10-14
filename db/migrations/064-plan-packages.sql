CREATE TABLE `plan_packages` (
  `plan_id` INTEGER NOT NULL,
  `package_code` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`plan_id`, `package_code`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `plan_packages` ADD FOREIGN KEY `foreign_plan_packages_packages` (`package_code`)
  REFERENCES `packages` (`code`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `plan_packages` ADD FOREIGN KEY `foreign_plan_packages_plans` (`plan_id`)
  REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
