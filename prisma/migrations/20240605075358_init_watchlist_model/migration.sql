-- CreateTable
CREATE TABLE "Watchlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "genres" TEXT[],
    "released_year" INTEGER NOT NULL,
    "runtime" INTEGER NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL,
    "casts" TEXT[],
    "liked" BOOLEAN NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);
