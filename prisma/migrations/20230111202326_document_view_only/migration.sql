/*
  Warnings:

  - You are about to drop the column `published` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pinnedDocumentId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `viewOnly` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_projectId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "published",
ADD COLUMN     "discoverable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "viewOnly" BOOLEAN NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "pinnedDocumentId" TEXT;

-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Revision_id_key" ON "Revision"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_pinnedDocumentId_key" ON "Project"("pinnedDocumentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_pinnedDocumentId_fkey" FOREIGN KEY ("pinnedDocumentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
