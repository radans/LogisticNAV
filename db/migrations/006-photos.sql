CREATE TABLE `photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `generated_id` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
