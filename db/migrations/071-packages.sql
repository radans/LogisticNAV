DELETE FROM `packages` WHERE `code` LIKE '%290500';
UPDATE `packages` SET `code` = TRIM(`code`);
