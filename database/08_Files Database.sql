CREATE TABLE `main`.`files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(512) NOT NULL,
  `ownerId` INT NOT NULL,
  `isPublic` TINYINT NOT NULL,
  `data` LONGBLOB NOT NULL,
  `mimetype` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idnew_table_UNIQUE` (`id` ASC) VISIBLE);

ALTER TABLE `main`.`files` 
ADD COLUMN `originalName` VARCHAR(512) NOT NULL AFTER `mimetype`;