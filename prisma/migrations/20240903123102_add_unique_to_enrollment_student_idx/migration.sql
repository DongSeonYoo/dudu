/*
  Warnings:

  - A unique constraint covering the columns `[student_idx]` on the table `enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uq_enrollment_student_idx" ON "enrollment"("student_idx");
