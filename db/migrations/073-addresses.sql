ALTER TABLE `addresses` ADD COLUMN `latitude` DECIMAL(11, 8) DEFAULT NULL;
ALTER TABLE `addresses` ADD COLUMN `longitude` DECIMAL(11, 8) DEFAULT NULL;
ALTER TABLE `addresses` ADD COLUMN `stripped_address` VARCHAR(1024) DEFAULT NULL;
