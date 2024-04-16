CREATE SCHEMA `my_database` ;

CREATE TABLE `my_database`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(1000) NULL DEFAULT NULL,
  `first_name` VARCHAR(1000) NULL DEFAULT NULL,
  `last_name` VARCHAR(1000) NULL DEFAULT NULL,
  `password` VARCHAR(200) NULL DEFAULT NULL,
  `email` VARCHAR(200) NULL DEFAULT NULL,
  `phone_number` VARCHAR(15) NULL DEFAULT NULL,
  `account_created` VARCHAR(100) NULL DEFAULT NULL,
  `account_permissions` VARCHAR(1000) NULL DEFAULT NULL,
  `profile_picture` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
COMMENT = 'A database table where all the users data is stored. Passwords, username and all other informations are visible. Only admins should have access to this table and only they are allowed to change things. Since this is not a website under any meaningful organisation, admins are allowed to do anything with this data. \n-Timon Fiedler (28.08.23 - 23:56)';

CREATE TABLE `my_database`.`deleted_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(1000) NULL DEFAULT NULL,
  `ip` VARCHAR(100) NULL DEFAULT NULL,
  `date` VARCHAR(100) NULL DEFAULT NULL,
  `feedback` VARCHAR(5000) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
COMMENT = 'This database stores all deleted accounts as well as the ip adress who deleted the account and the time. Feedback can be acquried by reading the feedback column.';