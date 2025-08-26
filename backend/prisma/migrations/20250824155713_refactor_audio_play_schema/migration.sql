/*
  Warnings:

  - You are about to drop the column `count` on the `audio_play` table. All the data in the column will be lost.
  - You are about to drop the column `last_played` on the `audio_play` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."audio_play" DROP COLUMN "count",
DROP COLUMN "last_played",
ADD COLUMN     "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
