/*
  Warnings:

  - The primary key for the `listening_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `listening_history` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."listening_history_user_id_listened_at_idx";

-- AlterTable
ALTER TABLE "public"."listening_history" DROP CONSTRAINT "listening_history_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "listening_history_pkey" PRIMARY KEY ("user_id", "audio_id");

-- CreateIndex
CREATE INDEX "listening_history_listened_at_user_id_idx" ON "public"."listening_history"("listened_at", "user_id");
