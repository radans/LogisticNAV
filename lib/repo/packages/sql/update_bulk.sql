INSERT INTO `packages` (
  `code`,
  `name`,
  `width`,
  `height`,
  `weight`
) VALUES :values ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `width` = VALUES(`width`),
  `height` = VALUES(`height`),
  `weight` = VALUES(`weight`)
