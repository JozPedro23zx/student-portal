import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../enrollment-output";
import { IEnrollmentRepository } from "@core/enrollment/infrastructure/enrollment-interface.repository";

export class FindAllEnrollmentsUseCase implements IUseCase<FindAllEnrollmentsUseCaseInput, EnrollmentOutput[]> {
    constructor(private readonly enrollmentRepo: IEnrollmentRepository) {}

    async execute(input?: FindAllEnrollmentsUseCaseInput): Promise<EnrollmentOutput[]> {
        let enrollments;
        
        if (!input || !Array.isArray(input.ids)) {
            enrollments = await this.enrollmentRepo.findAll();
        } else {
            const uuids = input.ids.map(id => new Uuid(id));
            enrollments = await this.enrollmentRepo.findByIds(uuids);
        }

        if (enrollments.length === 0) {
            throw new CustomNotFoundError(input?.ids, 'Enrollment');
        }

        return enrollments.map(enrollment => EnrollmentOutputMapper.toOutput(enrollment));
    }
}

export type FindAllEnrollmentsUseCaseInput = {
    ids?: string[];
}