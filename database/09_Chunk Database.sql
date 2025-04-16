CREATE TABLE `main`.`file_chunks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ownerId` INT NOT NULL,
  `chunkId` VARCHAR(128) NOT NULL,
  `chunkIndex` INT NOT NULL,
  `totalChunks` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = 'This table holds chunks temporarily untill all chunks are uploaded and can be merged.';

ALTER TABLE `main`.`file_chunks` 
ADD COLUMN `chunk` LONGBLOB NOT NULL AFTER `totalChunks`;
