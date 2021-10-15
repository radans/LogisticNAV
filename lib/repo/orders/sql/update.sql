UPDATE `orders`
SET `name`             = :name,
    `loading_date`     = :loading_date,
    `company`          = :company,
    `info`             = :info,
    `notes`            = :notes,
    `price`            = :price,
    `country`          = :country,
    `onload_addresses` = :onload_addresses,
    `unload_addresses` = :unload_addresses,
    `updated_at`       = UNIX_TIMESTAMP(),
    `author_id`        = :author_id,
    `full_load`        = :full_load,
    `import`           = :import,
    `client_transport` = :client_transport,
    `who`              = :who
WHERE `id` = :orderId
