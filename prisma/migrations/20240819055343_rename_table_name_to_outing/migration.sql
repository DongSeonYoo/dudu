/*
  Warnings:

  - You are about to drop the `table_name` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "table_name" DROP CONSTRAINT "attendance_idx_fk";

-- DropForeignKey
ALTER TABLE "table_name" DROP CONSTRAINT "student_idx_fk";

-- DropTable
DROP TABLE "table_name";

-- CreateTable
CREATE TABLE "outing" (
    "student_idx" INTEGER NOT NULL,
    "attendance_idx" INTEGER NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "ended_at" TIMESTAMPTZ(6) NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outing_pk" PRIMARY KEY ("attendance_idx","student_idx")
);

-- AddForeignKey
ALTER TABLE "outing" ADD CONSTRAINT "attendance_idx_fk" FOREIGN KEY ("attendance_idx") REFERENCES "attendance"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outing" ADD CONSTRAINT "student_idx_fk" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;
