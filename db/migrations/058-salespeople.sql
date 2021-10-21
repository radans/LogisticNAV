ALTER TABLE `salespeople` ADD COLUMN `color_hue` DECIMAL(5, 2) NOT NULL DEFAULT 0.5;
ALTER TABLE `salespeople` ADD COLUMN `color_saturation` DECIMAL(5, 2) NOT NULL DEFAULT 0;
ALTER TABLE `salespeople` ADD COLUMN `color_lightness` DECIMAL(5, 2) NOT NULL DEFAULT 0.95;
ALTER TABLE `salespeople` ADD COLUMN `color_rgb` VARCHAR(10) NOT NULL DEFAULT '#eeeeee';
