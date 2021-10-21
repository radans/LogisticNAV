INSERT INTO `settings` (
  `name`,
  `value`
) VALUES :values ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`)
