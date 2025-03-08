CREATE TABLE `main`.`shared_files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(128) NOT NULL,
  `deleted` TINYINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idnew_table_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds all filenames of files that users have shared. These files are now public.';
