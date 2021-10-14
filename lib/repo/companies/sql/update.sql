UPDATE `companies` SET
  `name` = :name,
  `contact` = :contact,
  `email` = :email,
  `address` = :address,
  `phone` = :phone
WHERE `id` = :id
