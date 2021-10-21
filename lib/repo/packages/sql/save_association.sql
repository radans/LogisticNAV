INSERT INTO `plan_packages` (`plan_id`, `package_code`) VALUES :values
ON DUPLICATE KEY UPDATE `package_code` = VALUES(`package_code`);
