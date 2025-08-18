-- CreateTable
CREATE TABLE "public"."tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "audio_id" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audio_file" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT,
    "size" INTEGER,
    "audio_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cover_file" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "audio_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cover_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tag_name_idx" ON "public"."tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "public"."genre"("name");

-- CreateIndex
CREATE INDEX "genre_name_idx" ON "public"."genre"("name");

-- CreateIndex
CREATE INDEX "audio_title_duration_idx" ON "public"."audio"("title", "duration");

-- CreateIndex
CREATE UNIQUE INDEX "audio_file_audio_id_key" ON "public"."audio_file"("audio_id");

-- CreateIndex
CREATE UNIQUE INDEX "cover_file_audio_id_key" ON "public"."cover_file"("audio_id");

-- AddForeignKey
ALTER TABLE "public"."tag" ADD CONSTRAINT "tag_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audio" ADD CONSTRAINT "audio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audio" ADD CONSTRAINT "audio_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audio_file" ADD CONSTRAINT "audio_file_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cover_file" ADD CONSTRAINT "cover_file_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
