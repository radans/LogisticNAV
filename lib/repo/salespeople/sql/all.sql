SELECT
  `salespeople`.`id` AS `id`,
  `salespeople`.`name` AS `name`,
  `salespeople`.`user_id` AS `user_id`,
  `salespeople`.`color_hue` AS `color_hue`,
  `salespeople`.`color_saturation` AS `color_saturation`,
  `salespeople`.`color_lightness` AS `color_lightness`,
  `salespeople`.`color_rgb` AS `color`
FROM `salespeople`
ORDER BY `salespeople`.`name` ASC
