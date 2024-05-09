/*
  Warnings:

  - Made the column `updated_at` on table `shortened_urls` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shortened_urls" ALTER COLUMN "updated_at" SET NOT NULL;
