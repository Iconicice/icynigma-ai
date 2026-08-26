CREATE TABLE `siteRotation` (
	`id` int NOT NULL,
	`quarterKey` varchar(16) NOT NULL,
	`catalogVersion` varchar(32) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteRotation_id` PRIMARY KEY(`id`)
);
