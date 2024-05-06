/*
  Warnings:

  - Added the required column `user_id` to the `shortened_urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shortened_urls" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "shortened_urls" ADD CONSTRAINT "shortened_urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
