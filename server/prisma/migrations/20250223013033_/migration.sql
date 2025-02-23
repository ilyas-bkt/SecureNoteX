/*
  Warnings:

  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Note` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[noteId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - The required column `noteId` was added to the `Note` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `Note_id_key` ON `Note`;

-- AlterTable
ALTER TABLE `Note` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `noteId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`noteId`);

-- CreateIndex
CREATE UNIQUE INDEX `Note_noteId_key` ON `Note`(`noteId`);
