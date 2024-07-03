/*
  Warnings:

  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN "phone_number" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

UPDATE "User" SET "phone_number" = '-';

ALTER TABLE "User" ALTER COLUMN "phone_number" SET NOT NULL;
