import CreateEnrollmentInput from "./input-create-enrollment.usecas";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../enrollment-output";
import { Enrollment } from "@core/enrollment/domain/enrollment";
import { EnrollmentStatus } from "@core/enrollment/domain/value-object/enrollmentStatus";
import { IUseCase } from "@core/@shared/application/use-case-interface";
import { IEnrollmentRepository } from "@core/enrollment/infrastructure/enrollment-interface.repository";

export class CreateEnrollmentUseCase implements IUseCase<CreateEnrollmentInput, EnrollmentOutput>{
    constructor(private enrollmentRepository: IEnrollmentRepository) {}

    async execute(input: CreateEnrollmentInput): Promise<EnrollmentOutput> {
        const enrollmentStatus = EnrollmentStatus.create(input.status)

        const enrollment = new Enrollment({
            student_id: input.student_id,
            class_id: input.class_id,
            enrollment_date: input.enrollment_date,
            status: enrollmentStatus
        });

        await this.enrollmentRepository.create(enrollment);

        return EnrollmentOutputMapper.toOutput(enrollment);
    }
}