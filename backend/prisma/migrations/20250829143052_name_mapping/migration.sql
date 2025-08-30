/*
  Warnings:

  - You are about to drop the column `listenedAt` on the `listening_history` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."listening_history_user_id_listenedAt_idx";

-- AlterTable
ALTER TABLE "public"."listening_history" DROP COLUMN "listenedAt",
ADD COLUMN     "listened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "listening_history_user_id_listened_at_idx" ON "public"."listening_history"("user_id", "listened_at");
