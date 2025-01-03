CREATE TABLE `main`.`home_counter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `count` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds the total amount users have clicked on the home icon.';


INSERT INTO `main`.`home_counter` (`count`) VALUES ('0');