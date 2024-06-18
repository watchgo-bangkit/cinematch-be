/*
  Warnings:

  - You are about to drop the column `casts` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `is_reviewed` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `released_year` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `runtime` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `vote_average` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_watchlist_id_fkey";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "casts",
DROP COLUMN "genres",
DROP COLUMN "is_reviewed",
DROP COLUMN "released_year",
DROP COLUMN "runtime",
DROP COLUMN "vote_average";

-- DropTable
DROP TABLE "Review";
