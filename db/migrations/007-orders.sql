DELETE FROM `orders`;
ALTER TABLE `orders` ADD COLUMN `created_at` BIGINT NOT NULL;
ALTER TABLE `orders` ADD COLUMN `updated_at` BIGINT NOT NULL;
