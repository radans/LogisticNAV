UPDATE `packages` SET
  `name` = :name,
  `archived` = :archived
WHERE `code` = :code
