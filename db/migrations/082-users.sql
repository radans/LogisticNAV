ALTER TABLE `users` ADD COLUMN `active` TINYINT(1) NOT NULL DEFAULT 1;
UPDATE `users` SET `active` = 0 WHERE `id` IN (19, 24, 10, 16, 31, 32, 22, 26);
