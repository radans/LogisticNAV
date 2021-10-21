ALTER TABLE `address_tokens` DROP PRIMARY KEY;
ALTER TABLE `address_tokens` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY;
CREATE INDEX `index_address_tokens_token` ON `address_tokens` (`token`);
CREATE INDEX `index_address_tokens_address_id` ON `address_tokens` (`address_id`);
