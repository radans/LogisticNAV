INSERT INTO `packages` (
  `code`,
  `name`,
  `width`,
  `height`,
  `weight`,
  `marker`,
  `double`,
  `archived`
) VALUES :values ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `width` = VALUES(`width`),
  `height` = VALUES(`height`),
  `weight` = VALUES(`weight`),
  `marker` = VALUES(`marker`),
  `double` = VALUES(`double`),
  `archived` = VALUES(`archived`)
