/*
  Warnings:

  - You are about to drop the `user_audio_play` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_audio_play" DROP CONSTRAINT "user_audio_play_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_audio_play" DROP CONSTRAINT "user_audio_play_user_id_fkey";

-- DropTable
DROP TABLE "public"."user_audio_play";

-- CreateTable
CREATE TABLE "public"."audio_play" (
    "user_id" TEXT NOT NULL,
    "audio_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "last_played" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audio_play_pkey" PRIMARY KEY ("user_id","audio_id")
);

-- AddForeignKey
ALTER TABLE "public"."audio_play" ADD CONSTRAINT "audio_play_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audio_play" ADD CONSTRAINT "audio_play_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
