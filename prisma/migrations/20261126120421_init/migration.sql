/*
  Warnings:

  - You are about to drop the column `slug` on the `event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Event_slug_key` ON `event`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `slug`;
