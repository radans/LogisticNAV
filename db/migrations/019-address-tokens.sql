CREATE TABLE `address_tokens` (
  `token` VARCHAR(255) NOT NULL,
  `address_id` INTEGER NOT NULL,
  PRIMARY KEY (`token`, `address_id`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
