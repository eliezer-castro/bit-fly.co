/*
  Warnings:

  - You are about to drop the `shortenedUrls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "shortenedUrls";

-- CreateTable
CREATE TABLE "shortened_urls" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shortened_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortened_urls_shortUrl_key" ON "shortened_urls"("shortUrl");
