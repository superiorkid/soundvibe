-- DropForeignKey
ALTER TABLE "public"."audio" DROP CONSTRAINT "audio_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."audio_file" DROP CONSTRAINT "audio_file_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cover_file" DROP CONSTRAINT "cover_file_audio_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."audio" ADD CONSTRAINT "audio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audio_file" ADD CONSTRAINT "audio_file_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cover_file" ADD CONSTRAINT "cover_file_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
