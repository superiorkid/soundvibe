-- CreateTable
CREATE TABLE "public"."playlist_cover_file" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "playlist_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlist_cover_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playlist_cover_file_playlist_id_key" ON "public"."playlist_cover_file"("playlist_id");

-- AddForeignKey
ALTER TABLE "public"."playlist_cover_file" ADD CONSTRAINT "playlist_cover_file_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
