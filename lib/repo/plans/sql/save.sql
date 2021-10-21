INSERT INTO `plans` (
  `author_id`,
  `name`,
  `data_json`,
  `created_at`,
  `updated_at`,
  `modified`,
  `modified_text`
) VALUES (
  :authorId,
  :name,
  :dataJson,
  UNIX_TIMESTAMP(),
  UNIX_TIMESTAMP(),
  :modified,
  :modifiedText
)
