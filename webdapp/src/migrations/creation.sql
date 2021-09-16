CREATE DATABASE julz;
use julz;
CREATE TABLE `users` (
  `idusers` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `contractAddress` varchar(45) DEFAULT NULL,
  `restriction` tinyint(1) DEFAULT '0',
  `treasuryAddress` varchar(45) NOT NULL,
  `withdrawTokenAddress` varchar(45) DEFAULT NULL,
  `abi` json DEFAULT NULL,
  `withdrawn` decimal(36,18) DEFAULT NULL,
  `lastWithdraw` date DEFAULT NULL,
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `transactions` (
  `idtransactions` int NOT NULL AUTO_INCREMENT,
  `hash` varchar(67) DEFAULT NULL,
  `idusers` int NOT NULL,
  `date` datetime DEFAULT NULL,
  `amount` decimal(36,18) DEFAULT NULL,
  `success` tinyint(1) DEFAULT '0',
  `withdraw` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idtransactions`),
  UNIQUE KEY `idtransactions_UNIQUE` (`idtransactions`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
