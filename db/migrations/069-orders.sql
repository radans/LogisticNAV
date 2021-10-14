ALTER TABLE `orders` ADD COLUMN `import` TINYINT(1) NOT NULL DEFAULT 0;
UPDATE `orders` SET `import` = 1 WHERE `salesperson_id` = 7;
UPDATE `orders` SET `salesperson_id` = NULL WHERE `import` = 1;
DELETE FROM `salespeople` WHERE `id` = 7;
CREATE INDEX `index_orders_import` ON `orders` (`import`);
