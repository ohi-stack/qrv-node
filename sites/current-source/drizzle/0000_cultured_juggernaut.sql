CREATE TABLE `issuer_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`organization` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`use_case` text NOT NULL,
	`message` text NOT NULL,
	`consent` integer NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `issuer_inquiries_email_idx` ON `issuer_inquiries` (`email`);--> statement-breakpoint
CREATE INDEX `issuer_inquiries_created_at_idx` ON `issuer_inquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `verification_events` (
	`id` text PRIMARY KEY NOT NULL,
	`qrvid` text NOT NULL,
	`result_status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_events_qrvid_idx` ON `verification_events` (`qrvid`);--> statement-breakpoint
CREATE TABLE `verification_records` (
	`qrvid` text PRIMARY KEY NOT NULL,
	`issuer` text NOT NULL,
	`issuer_code` text NOT NULL,
	`subject` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`issued_at` text NOT NULL,
	`expires_at` text,
	`reason` text,
	`privacy_mode` text DEFAULT 'PUBLIC' NOT NULL,
	`record_hash` text NOT NULL,
	`signature_state` text DEFAULT 'PENDING_ED25519' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_records_status_idx` ON `verification_records` (`status`);--> statement-breakpoint
CREATE INDEX `verification_records_issuer_idx` ON `verification_records` (`issuer_code`);