CREATE TABLE `orders_onload` (
  `order_id` INTEGER NOT NULL,
  `address_id` INTEGER NOT NULL,
  `rank` TINYINT,
  PRIMARY KEY (`order_id`, `address_id`, `rank`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
