-- 한글 깨짐 방지
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `TEST_BOARD`;

CREATE DATABASE `TEST_BOARD`;
USE `TEST_BOARD`;

DROP TABLE IF EXISTS `board`;

CREATE TABLE `board` (
    `BOARD_NO` int NOT NULL AUTO_INCREMENT,
    `TITLE` varchar(30) DEFAULT NULL,
    `CONTENTS` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`BOARD_NO`)
);

LOCK TABLES `board` WRITE;

INSERT INTO `board` (`TITLE`, `CONTENTS`)
VALUES
        ('Test Title', 'Test Content'),
        ('Test Title02', 'Test Contents02');

UNLOCK TABLES;
