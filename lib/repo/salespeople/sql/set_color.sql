UPDATE `salespeople` SET
  `color_hue` = :hue,
  `color_saturation` = :saturation,
  `color_lightness` = :lightness,
  `color_rgb` = :rgb
WHERE `id` = :personId
