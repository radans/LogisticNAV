ALTER TABLE `users` ADD COLUMN `master_user` TINYINT(1) NOT NULL DEFAULT 0;
UPDATE `users` SET `master_user` = 1 WHERE `email` = 'kullo.kala@lasita.com';
