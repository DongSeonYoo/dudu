-- CreateTable
CREATE TABLE "table_name" (
    "student_idx" INTEGER NOT NULL,
    "attendance_idx" INTEGER NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "ended_at" TIMESTAMPTZ(6) NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outing_pk" PRIMARY KEY ("attendance_idx","student_idx")
);

-- AddForeignKey
ALTER TABLE "table_name" ADD CONSTRAINT "attendance_idx_fk" FOREIGN KEY ("attendance_idx") REFERENCES "attendance"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "table_name" ADD CONSTRAINT "student_idx_fk" FOREIGN KEY ("student_idx") REFERENCES "student"("idx") ON DELETE NO ACTION ON UPDATE NO ACTION;
