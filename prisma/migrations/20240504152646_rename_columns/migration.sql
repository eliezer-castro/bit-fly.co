/*
  Warnings:

  - You are about to drop the column `longUrl` on the `shortened_urls` table. All the data in the column will be lost.
  - You are about to drop the column `shortUrl` on the `shortened_urls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[short_url]` on the table `shortened_urls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `long_url` to the `shortened_urls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_url` to the `shortened_urls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "shortened_urls_shortUrl_key";

-- AlterTable
ALTER TABLE "shortened_urls" DROP COLUMN "longUrl",
DROP COLUMN "shortUrl",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "long_url" TEXT NOT NULL,
ADD COLUMN     "short_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shortened_urls_short_url_key" ON "shortened_urls"("short_url");
