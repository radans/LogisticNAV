ALTER TABLE `addresses` ADD COLUMN `archived` TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE `addresses` ADD COLUMN `notes` VARCHAR(4096) DEFAULT NULL;