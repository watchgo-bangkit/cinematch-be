/*
  Warnings:

  - Added the required column `movie_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "movie_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Review_movie_id_idx" ON "Review"("movie_id");
