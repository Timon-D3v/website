CREATE TABLE `main`.`projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(512) NOT NULL,
  `description` TEXT NOT NULL,
  `url` VARCHAR(512) NOT NULL,
  `image_url` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idnew_table_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds all my projects to display on my portfolio.';

