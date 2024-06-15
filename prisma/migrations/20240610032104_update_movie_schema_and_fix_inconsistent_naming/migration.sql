/*
  Warnings:

  - You are about to drop the `_MovieToGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieToGenre" DROP CONSTRAINT "_MovieToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToGenre" DROP CONSTRAINT "_MovieToGenre_B_fkey";

-- DropTable
DROP TABLE "_MovieToGenre";
