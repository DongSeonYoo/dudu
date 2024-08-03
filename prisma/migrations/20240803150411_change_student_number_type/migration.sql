/*
  Warnings:

  - Changed the type of `student_number` on the `student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "student_number",
ADD COLUMN     "student_number" SMALLINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "unique_student_number_deleted_at" ON "student"("student_number", "deleted_at");
