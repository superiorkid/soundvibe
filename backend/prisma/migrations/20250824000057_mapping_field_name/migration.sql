/*
  Warnings:

  - You are about to drop the column `likesCount` on the `audio` table. All the data in the column will be lost.
  - You are about to drop the column `playsCount` on the `audio` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."audio_duration_slug_likesCount_idx";

-- AlterTable
ALTER TABLE "public"."audio" DROP COLUMN "likesCount",
DROP COLUMN "playsCount",
ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plays_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "audio_duration_slug_likes_count_idx" ON "public"."audio"("duration", "slug", "likes_count");
