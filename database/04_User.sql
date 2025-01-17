CREATE TABLE `main`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(512) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `family_name` VARCHAR(128) NOT NULL,
  `picture` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `iduser_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds all user data';
