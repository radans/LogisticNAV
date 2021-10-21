UPDATE `plans` SET
  `name` = :name,
  `author_id` = :authorId,
  `data_json` = :dataJson,
  `updated_at` = UNIX_TIMESTAMP(),
  `modified` = :modified,
  `modified_text` = :modifiedText
WHERE `id` = :planId
