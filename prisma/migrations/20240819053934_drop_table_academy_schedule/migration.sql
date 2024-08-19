/*
  Warnings:

  - You are about to drop the `academy_schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "academy_schedule" DROP CONSTRAINT "fk_student_to_academy_schedule";

-- DropTable
DROP TABLE "academy_schedule";
