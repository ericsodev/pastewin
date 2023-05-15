-- DropForeignKey
ALTER TABLE "Revision" DROP CONSTRAINT "Revision_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
