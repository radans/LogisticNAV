DELETE FROM `orders`;
ALTER TABLE `orders` ADD COLUMN `price` DECIMAL(6, 2) NOT NULL;
ALTER TABLE `orders` ADD COLUMN `country` VARCHAR (255) NOT NULL DEFAULT '';
ALTER TABLE `orders` ADD COLUMN `client` VARCHAR (255) NOT NULL DEFAULT '';
