-- CreateTable
CREATE TABLE "Animal" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "age" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);
