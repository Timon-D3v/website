CREATE TABLE `my_database`.`pictures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment` VARCHAR(1000) NULL DEFAULT NULL,
  `description` VARCHAR(1000) NULL DEFAULT NULL,
  `path` VARCHAR(1000) NULL DEFAULT NULL,
  `image` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`))
COMMENT = 'Here are all my Images stored. All Images are encrypted in Base64 and only private pictures are stored.';
