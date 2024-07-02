import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Enrollment } from "@core/enrollment/domain/enrollment";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../enrollment-output";
import { IEnrollmentRepository } from "@core/enrollment/infrastructure/enrollment-interface.repository";

export class FindEnrollmentsByClassRoomUsecase implements IUseCase<FindEnrollmentsByClassRoomInput, EnrollmentOutput[]> {
    constructor(private enrollmentRepository: IEnrollmentRepository) {}

    async execute(input: FindEnrollmentsByClassRoomInput): Promise<EnrollmentOutput[]> {
        const enrollments: Enrollment[] = await this.enrollmentRepository.findByClassRoom(new Uuid(input.class_id));

        if (enrollments.length === 0) {
            throw new CustomNotFoundError(input.class_id, Enrollment.name);
        }

        return enrollments.map(EnrollmentOutputMapper.toOutput);
    }
}

export type FindEnrollmentsByClassRoomInput = {
    class_id: string;
}