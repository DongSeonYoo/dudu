/*
  Warnings:

  - Changed the type of `started_time` on the `academy_schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ended_time` on the `academy_schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `start_time` on the `outing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end_time` on the `outing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "academy_schedule" DROP COLUMN "started_time",
ADD COLUMN     "started_time" TIME(0) NOT NULL,
DROP COLUMN "ended_time",
ADD COLUMN     "ended_time" TIME(0) NOT NULL;

-- AlterTable
ALTER TABLE "attendance" ALTER COLUMN "check_in_at" SET DATA TYPE TIMETZ(6),
ALTER COLUMN "check_out_at" SET DATA TYPE TIMETZ(6);

-- AlterTable
ALTER TABLE "outing" DROP COLUMN "start_time",
ADD COLUMN     "start_time" TIME(0) NOT NULL,
DROP COLUMN "end_time",
ADD COLUMN     "end_time" TIME(0) NOT NULL;
