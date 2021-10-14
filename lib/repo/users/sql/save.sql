INSERT INTO `users` (
  `email`,
  `name`,
  `phone`,
  `salt`,
  `hash`,
  `order_email`
) VALUES (
  :email,
  :name,
  :phone,
  :salt,
  :hash,
  :email
)
