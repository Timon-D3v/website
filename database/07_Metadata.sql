CREATE TABLE `main`.`metadata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `fileSystem` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idmetadata_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds all the metadata needed for the cloud';
