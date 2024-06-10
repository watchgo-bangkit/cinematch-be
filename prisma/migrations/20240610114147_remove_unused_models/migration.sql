/*
  Warnings:

  - You are about to drop the `Cast` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Crew` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieToGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cast" DROP CONSTRAINT "Cast_credit_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "Crew" DROP CONSTRAINT "Crew_credit_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieToGenre" DROP CONSTRAINT "MovieToGenre_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieToGenre" DROP CONSTRAINT "MovieToGenre_movie_id_fkey";

-- DropTable
DROP TABLE "Cast";

-- DropTable
DROP TABLE "Credit";

-- DropTable
DROP TABLE "Crew";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "MovieToGenre";
