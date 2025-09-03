/*
  Warnings:

  - You are about to drop the column `description` on the `playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."playlist" DROP COLUMN "description",
ADD COLUMN     "audioCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;
