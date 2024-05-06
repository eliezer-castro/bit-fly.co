-- CreateTable
CREATE TABLE "shortenedUrls" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shortenedUrls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortenedUrls_shortUrl_key" ON "shortenedUrls"("shortUrl");
