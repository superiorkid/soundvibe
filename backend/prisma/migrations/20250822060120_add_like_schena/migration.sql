-- DropIndex
DROP INDEX "public"."audio_duration_slug_idx";

-- AlterTable
ALTER TABLE "public"."audio" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."like" (
    "user_id" TEXT NOT NULL,
    "audio_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("user_id","audio_id")
);

-- CreateIndex
CREATE INDEX "audio_duration_slug_likesCount_idx" ON "public"."audio"("duration", "slug", "likesCount");

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
