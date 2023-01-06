/*
  Warnings:

  - A unique constraint covering the columns `[publishedDocumentId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Made the column `projectId` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `publishedDocumentId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_projectId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "publishedDocumentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_publishedDocumentId_key" ON "Project"("publishedDocumentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_publishedDocumentId_fkey" FOREIGN KEY ("publishedDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
