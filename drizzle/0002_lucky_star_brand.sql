CREATE TABLE `cart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `stripeCheckoutSessionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);