/*
  Warnings:

  - Changed the type of `type` on the `student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TYPE" AS ENUM ('STUDENT', 'REAPEATER');

-- AlterTable
ALTER TABLE "student" DROP COLUMN "type",
ADD COLUMN     "type" "TYPE" NOT NULL;
