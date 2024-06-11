/*
  Warnings:

  - You are about to drop the column `preferences` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferences";

-- CreateTable
CREATE TABLE "Crew" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" DECIMAL(5,2) NOT NULL,
    "profile_path" TEXT NOT NULL,
    "crew_id" INTEGER NOT NULL,
    "tmdb_credit_id" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "credit_id" INTEGER,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cast" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" DECIMAL(5,2) NOT NULL,
    "profile_path" TEXT NOT NULL,
    "cast_id" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "tmdb_credit_id" TEXT NOT NULL,
    "credit_id" INTEGER,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "director" TEXT NOT NULL,
    "movie_id" INTEGER NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "runtime" INTEGER NOT NULL,
    "vote_average" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieToGenre" (
    "movie_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "MovieToGenre_pkey" PRIMARY KEY ("movie_id","genre_id")
);

-- CreateTable
CREATE TABLE "_MovieToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Crew_tmdb_credit_id_key" ON "Crew"("tmdb_credit_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cast_tmdb_credit_id_key" ON "Cast"("tmdb_credit_id");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_movie_id_key" ON "Credit"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_tmdb_id_key" ON "Genre"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToGenre_AB_unique" ON "_MovieToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToGenre_B_index" ON "_MovieToGenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToGenre_AB_unique" ON "_UserToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToGenre_B_index" ON "_UserToGenre"("B");

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cast" ADD CONSTRAINT "Cast_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "Credit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieToGenre" ADD CONSTRAINT "MovieToGenre_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieToGenre" ADD CONSTRAINT "MovieToGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToGenre" ADD CONSTRAINT "_MovieToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToGenre" ADD CONSTRAINT "_MovieToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToGenre" ADD CONSTRAINT "_UserToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToGenre" ADD CONSTRAINT "_UserToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
