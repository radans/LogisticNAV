INSERT INTO `orders` (
  `name`,
  `loading_date`,
  `company`,
  `info`,
  `notes`,
  `price`,
  `country`,
  `onload_addresses`,
  `unload_addresses`,
  `created_at`,
  `updated_at`,
  `author_id`,
  `full_load`,
  `import`,
  `client_transport`
) VALUES (
  :name,
  :loading_date,
  :company,
  :info,
  :notes,
  :price,
  :country,
  :onload_addresses,
  :unload_addresses,
  UNIX_TIMESTAMP(),
  UNIX_TIMESTAMP(),
  :author_id,
  :full_load,
  :import,
  :client_transport
)
