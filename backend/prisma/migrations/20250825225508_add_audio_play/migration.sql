/*
  Warnings:

  - The primary key for the `audio_play` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,audio_id,played_at]` on the table `audio_play` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `audio_play` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."audio_play" DROP CONSTRAINT "audio_play_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "audio_play_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "audio_play_user_id_audio_id_played_at_key" ON "public"."audio_play"("user_id", "audio_id", "played_at");
