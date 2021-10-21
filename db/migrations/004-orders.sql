CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR (255) NOT NULL,
    `loading_date` DATE NOT NULL,
    `company` INTEGER NOT NULL,
    `info` TEXT NOT NULL,
    `notes` TEXT NOT NULL,
    `onload_json` TEXT NOT NULL,
    `unload_json` TEXT NOT NULL,
    `onload_addresses` TEXT NOT NULL,
    `unload_addresses` TEXT NOT NULL,
    `vehicle` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
