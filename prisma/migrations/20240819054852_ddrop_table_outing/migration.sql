/*
  Warnings:

  - You are about to drop the `outing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "outing" DROP CONSTRAINT "fk_attendance_to_outing";

-- DropForeignKey
ALTER TABLE "outing" DROP CONSTRAINT "fk_student_to_outing";

-- DropTable
DROP TABLE "outing";
