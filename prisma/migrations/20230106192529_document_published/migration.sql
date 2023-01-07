/*
  Warnings:

  - You are about to drop the column `publishedDocumentId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_publishedDocumentId_fkey";

-- DropIndex
DROP INDEX "Project_publishedDocumentId_key";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "publishedDocumentId";
