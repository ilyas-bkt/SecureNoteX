/*
  Warnings:

  - Added the required column `expireAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` ADD COLUMN `expireAt` DATETIME(3) NOT NULL;
