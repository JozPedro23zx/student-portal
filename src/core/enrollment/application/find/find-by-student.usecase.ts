import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EnrollmentSequelizeRepository } from "@core/enrollment/infrastructure/sequelize/enrollment-sequelize.repository";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../enrollment-output";
import { Enrollment } from "@core/enrollment/domain/enrollment";

export class FindEnrollmentByStudentUsecase implements IUseCase<FindEnrollmentByStudentInput, EnrollmentOutput> {
    constructor(private enrollmentRepository: EnrollmentSequelizeRepository) {}

    async execute(input: FindEnrollmentByStudentInput): Promise<EnrollmentOutput> {
        const enrollment = await this.enrollmentRepository.findByStudent(new Uuid(input.student_id));

        if (!enrollment) {
            throw new CustomNotFoundError(input.student_id, Enrollment.name );
        }

        return EnrollmentOutputMapper.toOutput(enrollment);
    }
}

export type FindEnrollmentByStudentInput = {
    student_id: string;
}