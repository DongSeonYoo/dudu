-- CreateTable
CREATE TABLE "academy_schedule" (
    "idx" SERIAL NOT NULL,
    "student_idx" INTEGER NOT NULL,
    "academy_name" VARCHAR NOT NULL,
    "days_of_week" SMALLINT NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "ended_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academy_schedule_pk" PRIMARY KEY ("idx")
);

-- AddForeignKey
ALTER TABLE "academy_schedule" ADD CONSTRAINT "academy_schedule_student_idx_fk" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;
