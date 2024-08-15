/*
  Warnings:

  - The `check_out_at` column on the `attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `check_in_at` on the `attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "check_in_at",
ADD COLUMN     "check_in_at" TIMESTAMPTZ(6) NOT NULL,
DROP COLUMN "check_out_at",
ADD COLUMN     "check_out_at" TIMESTAMPTZ(6);
