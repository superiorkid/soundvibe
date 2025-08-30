-- CreateTable
CREATE TABLE "public"."listening_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "audio_id" TEXT NOT NULL,
    "listenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listening_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listening_history_user_id_listenedAt_idx" ON "public"."listening_history"("user_id", "listenedAt");

-- AddForeignKey
ALTER TABLE "public"."listening_history" ADD CONSTRAINT "listening_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listening_history" ADD CONSTRAINT "listening_history_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
