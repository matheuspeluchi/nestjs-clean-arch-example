CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `password` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `hachRefreshToken` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UN` (`username`)
) ENGINE=InnoDB A


INSERT INTO TABLE `user` (username,password,createdAt,updatedAt,lastLogin,hachRefreshToken) VALUES
	 ('admin','$2b$10$vCRSNvlk964PtXa1hkYjxeX0va2qWJYbGKC6r.YWCIptRrdGo3e1u','2023-05-31 08:54:11','2023-05-31 09:11:27','2023-05-31 09:11:13','$2b$10$4h.uzUu2uzOzPq4n4yLKh.X6Q6rRTiSW1f0Q3YSXJT8rNXUoW08o6');
