import { Enrollment } from "../domain/enrollment";

export type EnrollmentOutput = {
    id: string;
    student_id: string;
    class_id: string;
    enrollment_date: Date;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export class EnrollmentOutputMapper {
    static toOutput(entity: Enrollment): EnrollmentOutput {
        return {
            id: entity.entityId.id,
            student_id: entity.student_id,
            class_id: entity.class_id,
            enrollment_date: entity.enrollment_date,
            status: entity.status.type,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt
        }
    }
}