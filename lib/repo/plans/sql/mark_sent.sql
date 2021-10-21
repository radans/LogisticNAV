UPDATE `plans`
SET `sent_at` = UNIX_TIMESTAMP()
WHERE `id` = :planId
