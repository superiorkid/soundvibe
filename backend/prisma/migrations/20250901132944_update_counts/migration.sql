/*
  Warnings:

  - You are about to drop the column `audioCount` on the `playlist` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."playlist" DROP COLUMN "audioCount",
DROP COLUMN "likeCount",
ADD COLUMN     "audio_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;
