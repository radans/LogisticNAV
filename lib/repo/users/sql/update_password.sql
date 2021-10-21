UPDATE `users` SET
  `salt` = :salt,
  `hash` = :hash
WHERE `email` = :email
