CREATE TABLE `ai_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` enum('display','search','social','email','retargeting') NOT NULL,
	`status` enum('draft','pending_approval','active','paused','completed') DEFAULT 'draft',
	`budget` decimal(10,2),
	`spent` decimal(10,2) DEFAULT '0',
	`impressions` bigint DEFAULT 0,
	`clicks` bigint DEFAULT 0,
	`conversions` int DEFAULT 0,
	`ctr` decimal(5,2) DEFAULT '0',
	`roi` decimal(8,2) DEFAULT '0',
	`targetAudience` json DEFAULT ('[]'),
	`aiGenerated` boolean DEFAULT true,
	`aiConfidence` decimal(5,2) DEFAULT '0',
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`totalRevenue` decimal(12,2) DEFAULT '0',
	`totalOrders` int DEFAULT 0,
	`totalVisitors` int DEFAULT 0,
	`conversionRate` decimal(5,2) DEFAULT '0',
	`aiDecisions` int DEFAULT 0,
	`humanDecisions` int DEFAULT 0,
	`aiAccuracy` decimal(5,2) DEFAULT '0',
	`avgOrderValue` decimal(10,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_pricing_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`oldPrice` decimal(10,2) NOT NULL,
	`newPrice` decimal(10,2) NOT NULL,
	`reason` text,
	`aiConfidence` decimal(5,2),
	`demandFactor` decimal(5,2),
	`competitorFactor` decimal(5,2),
	`status` enum('applied','pending','rejected') DEFAULT 'applied',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_pricing_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_validation_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('product','campaign','pricing','content') NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`data` json,
	`aiConfidence` decimal(5,2),
	`priority` enum('low','medium','high','critical') DEFAULT 'medium',
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`reviewedBy` int,
	`reviewNote` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_validation_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cartId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`priceAtAdd` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(256) NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`orderNumber` varchar(32) NOT NULL,
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`totalAmount` decimal(10,2) NOT NULL,
	`shippingAddress` json,
	`paymentMethod` varchar(64),
	`paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text,
	`shortDescription` varchar(512),
	`price` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`categoryId` int,
	`imageUrl` text,
	`images` json DEFAULT ('[]'),
	`stock` int DEFAULT 0,
	`badge` enum('innovation','tendance','bestseller','nouveau','promo'),
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`rating` decimal(3,2) DEFAULT '0',
	`reviewCount` int DEFAULT 0,
	`tags` json DEFAULT ('[]'),
	`aiScore` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
