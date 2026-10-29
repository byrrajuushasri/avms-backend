CREATE TABLE IF NOT EXISTS `matrimonial_interest_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_profile_id` int NOT NULL,
  `recipient_profile_id` int NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_matrimonial_interest_pair` (`sender_profile_id`, `recipient_profile_id`),
  KEY `idx_matrimonial_interest_recipient_status` (`recipient_profile_id`, `status`),
  CONSTRAINT `fk_matrimonial_interest_sender`
    FOREIGN KEY (`sender_profile_id`) REFERENCES `matrimonial` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_matrimonial_interest_recipient`
    FOREIGN KEY (`recipient_profile_id`) REFERENCES `matrimonial` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
