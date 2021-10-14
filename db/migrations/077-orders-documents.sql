CREATE TABLE `order_documents` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `order_id` INTEGER NOT NULL,
  `original_name` VARCHAR (1024) NOT NULL,  
  `comment` VARCHAR (1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `order_documents` ADD FOREIGN KEY `order_documents_order` (`order_id`)
  REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
