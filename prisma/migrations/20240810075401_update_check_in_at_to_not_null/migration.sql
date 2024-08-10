/*
  Warnings:

  - Made the column `check_in_at` on table `attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attendance" ALTER COLUMN "check_in_at" SET NOT NULL;
