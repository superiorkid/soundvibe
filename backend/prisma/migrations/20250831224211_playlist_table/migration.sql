-- CreateTable
CREATE TABLE "public"."playlist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "cover_url" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_audio" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "audio_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_audio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_like" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playlist_slug_key" ON "public"."playlist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_audio_playlist_id_audio_id_key" ON "public"."playlist_audio"("playlist_id", "audio_id");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_like_playlist_id_user_id_key" ON "public"."playlist_like"("playlist_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."playlist" ADD CONSTRAINT "playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_audio" ADD CONSTRAINT "playlist_audio_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_audio" ADD CONSTRAINT "playlist_audio_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_like" ADD CONSTRAINT "playlist_like_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_like" ADD CONSTRAINT "playlist_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
