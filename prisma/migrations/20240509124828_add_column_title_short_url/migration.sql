/*
  Warnings:

  - Added the required column `title` to the `shortened_urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shortened_urls" ADD COLUMN     "title" TEXT NOT NULL;
