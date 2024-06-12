-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "watchlist_id" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_watchlist_id_idx" ON "Review"("watchlist_id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "Watchlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
