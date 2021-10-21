ALTER TABLE `orders` CHANGE COLUMN `company` `company` INTEGER DEFAULT NULL;
UPDATE `orders` SET `company` = NULL WHERE `company` = 0;
