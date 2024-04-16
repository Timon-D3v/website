CREATE TABLE `my_database`.`settings` (
  `username` varchar(200) NOT NULL,
  `darkmode` int DEFAULT '0',
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Store settings and preferences of all user.';