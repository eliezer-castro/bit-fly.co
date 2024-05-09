-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shortened_urls" (
    "id" TEXT NOT NULL,
    "long_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "clickDates" TIMESTAMP(3)[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shortened_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shortened_urls_short_url_key" ON "shortened_urls"("short_url");

-- AddForeignKey
ALTER TABLE "shortened_urls" ADD CONSTRAINT "shortened_urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
