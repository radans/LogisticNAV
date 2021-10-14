CREATE OR REPLACE ALGORITHM = MERGE VIEW `view_qlik_addresses` AS (
  SELECT
    `addresses`.`id` AS `id`,
    `addresses`.`stripped_address` AS `address`,
    `addresses`.`latitude` AS `latitude`,
    `addresses`.`longitude` AS `longitude`,
    `addresses`.`region` AS `region`,
    `addresses`.`marker` AS `marker`,
    `addresses`.`notes` AS `notes`
  FROM `addresses`
);
