import { Grade } from "../domain/grade.entity";

export type GradeOutput= {
    id: string;
    student_id: string;
    subject: string;
    exam: number;
    assignment: number;
    others: number;
    createdAt: Date;
    updatedAt: Date;
}

export class GradeOutputMapper {
    static toOutput(grade: Grade): GradeOutput {
        return {
            id: grade.entityId.id,
            student_id: grade.student_id,
            subject: grade.subject.type,
            exam: grade.exam,
            assignment: grade.assignment,
            others: grade.others,
            createdAt: grade.createdAt,
            updatedAt: grade.updatedAt,
        };
    }
}