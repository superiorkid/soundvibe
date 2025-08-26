-- CreateTable
CREATE TABLE "public"."user_audio_play" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "audio_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "last_played" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_audio_play_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_audio_play_user_id_audio_id_key" ON "public"."user_audio_play"("user_id", "audio_id");

-- AddForeignKey
ALTER TABLE "public"."user_audio_play" ADD CONSTRAINT "user_audio_play_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_audio_play" ADD CONSTRAINT "user_audio_play_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
