CREATE TABLE `settings` (
    `name` VARCHAR (255) NOT NULL,
    `value` VARCHAR (255) DEFAULT NULL,
    PRIMARY KEY (`name`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `settings` (`name`, `value`)
VALUES
  ('logo', NULL),
  ('loading_et', NULL),
  ('loading_en', NULL),
  ('loading_ru', NULL);
