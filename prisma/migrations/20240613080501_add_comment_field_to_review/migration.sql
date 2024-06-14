/*
  Warnings:

  - You are about to drop the column `review` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Review` table. All the data in the column will be lost.
  - Added the required column `comment` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "review",
DROP COLUMN "title",
ADD COLUMN     "comment" TEXT NOT NULL;
