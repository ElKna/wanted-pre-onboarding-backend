-- 한글 깨짐 방지
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `TEST_BOARD`;

CREATE DATABASE `TEST_BOARD`;
USE `TEST_BOARD`;

DROP TABLE IF EXISTS `board`;

CREATE TABLE `board` (
    `board_no` int NOT NULL AUTO_INCREMENT,
    `title` varchar(30) DEFAULT NULL,
    `contents` varchar(100) DEFAULT NULL,
    `user` varchar(30) NOT NULL,
    PRIMARY KEY (`board_no`)
);

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `_id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(30) UNIQUE NOT NULL,
    `password` varchar(64) NOT NULL,
    `salt` varchar(32) NOT NULL,
    PRIMARY KEY (`_id`)
);

LOCK TABLES `board` WRITE;

INSERT INTO `board` (`title`, `contents`, `user`)
VALUES
        ('Test Title', 'Test Content', 'admin@mail.com'),
        ('Test Title02', 'Test Contents02', 'admin@mail.com'),
        ('Test Title03', 'No contents', 'admin@mail.com');

UNLOCK TABLES;

LOCK TABLES `user` WRITE;

INSERT INTO `user` (`email`, `password`, `salt`)
VALUES
        ('test@mail.com', '12345678', '32165478321654783216547832165478'),
        ('start@mail.com', '87654321', '82546728825467288254672882546728'),
        ('admin@mail.com', '00000000', '39428678394286783942867839428678');

UNLOCK TABLES;
