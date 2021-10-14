CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR (255) NOT NULL,
    `name` VARCHAR (255) DEFAULT NULL,
    `phone` VARCHAR (255) DEFAULT NULL,
    `collapsed` TINYINT(1) NOT NULL DEFAULT 0,
    `salt` VARCHAR(255) NOT NULL,
    `hash` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `users` (`email`, `salt`, `hash`)
VALUES ('test@lasita.com', '718bf5e1-35a6-4be5-8108-df046545917e','5160350c5df6be8c97a53875b98ba31eb6c9e1b30f66a0b9eb3face61b612687f6a35decc9d737975770a3bc002250c592f2f36b5b286933b94cb828056d435f');

-- user password: password_123