CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token_hash` varchar(64) NOT NULL,
  `member_id` varchar(30) NOT NULL,
  `account_type` varchar(20) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_password_reset_tokens_token_hash` (`token_hash`),
  KEY `IDX_password_reset_tokens_member_id` (`member_id`),
  KEY `IDX_password_reset_tokens_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
