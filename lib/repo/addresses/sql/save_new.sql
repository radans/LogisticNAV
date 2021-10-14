INSERT INTO `addresses` (
  `archived`,
  `notes`,
  `name`,
  `region`,
  `address`,
  `marker`,
  `latitude`,
  `longitude`,
  `stripped_address`
) VALUES (
  :archived,
  :notes,
  :name,
  :region,
  :address,
  :marker,
  :latitude,
  :longitude,
  :strippedAddress
)
