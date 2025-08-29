-- CreateTable
CREATE TABLE "public"."repost" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "audio_id" TEXT NOT NULL,

    CONSTRAINT "repost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repost_user_id_audio_id_key" ON "public"."repost"("user_id", "audio_id");

-- AddForeignKey
ALTER TABLE "public"."repost" ADD CONSTRAINT "repost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repost" ADD CONSTRAINT "repost_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
