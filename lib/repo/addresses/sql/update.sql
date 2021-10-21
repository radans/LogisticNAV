UPDATE `addresses` SET
  `archived` = :archived,
  `notes` = :notes,
  `name` = :name,
  `region` = :region,
  `address` = :address,
  `marker` = :marker,
  `latitude` = :latitude,
  `longitude` = :longitude,
  `stripped_address` = :strippedAddress
WHERE `id` = :addressId
