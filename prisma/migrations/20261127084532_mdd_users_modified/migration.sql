/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('SECURITY_ADMIN', 'ADMIN', 'SUB_ADMIN') NOT NULL DEFAULT 'SUB_ADMIN';
