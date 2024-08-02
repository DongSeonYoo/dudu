-- CreateTable
CREATE TABLE "academy_schedule" (
    "idx" SERIAL NOT NULL,
    "student_idx" INTEGER NOT NULL,
    "academy_name" VARCHAR NOT NULL,
    "days_of_week" SMALLINT NOT NULL,
    "started_time" TIME(6) NOT NULL,
    "ended_time" TIME(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academy_schedule_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "attendance" (
    "idx" SERIAL NOT NULL,
    "student_idx" INTEGER NOT NULL,
    "check_in_at" TIME(6),
    "check_out_at" TIME(6),
    "is_outing" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "idx" SERIAL NOT NULL,
    "student_idx" INTEGER NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "ended_at" TIMESTAMPTZ(6) NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "outing" (
    "student_idx" INTEGER NOT NULL,
    "attendance_idx" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outing_pkey" PRIMARY KEY ("student_idx","attendance_idx")
);

-- CreateTable
CREATE TABLE "parent" (
    "idx" SERIAL NOT NULL,
    "student_idx" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "phone_number" CHAR(11) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "student" (
    "idx" SERIAL NOT NULL,
    "type" VARCHAR NOT NULL,
    "gender" VARCHAR NOT NULL,
    "school" VARCHAR NOT NULL DEFAULT '무소속',
    "name" VARCHAR NOT NULL,
    "phone_number" CHAR(11) NOT NULL,
    "email" VARCHAR,
    "student_number" CHAR(4) NOT NULL,
    "birth_date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_student_number_deleted_at" ON "student"("student_number", "deleted_at");

-- AddForeignKey
ALTER TABLE "academy_schedule" ADD CONSTRAINT "fk_student_to_academy_schedule" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "fk_student_to_attendance" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "fk_student_to_enrollment" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outing" ADD CONSTRAINT "fk_attendance_to_outing" FOREIGN KEY ("attendance_idx") REFERENCES "attendance"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outing" ADD CONSTRAINT "fk_student_to_outing" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "fk_student_to_parent" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;
