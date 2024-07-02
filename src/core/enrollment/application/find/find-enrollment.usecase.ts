import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../enrollment-output";
import { Enrollment } from "@core/enrollment/domain/enrollment";
import { IEnrollmentRepository } from "@core/enrollment/infrastructure/enrollment-interface.repository";

export class FindEnrollmentUseCase implements IUseCase<FindEnrollmentUseCaseInput, EnrollmentOutput> {
    constructor(private readonly enrollmentRepo: IEnrollmentRepository) {}

    async execute(input: FindEnrollmentUseCaseInput): Promise<EnrollmentOutput> {
        const enrollment = await this.enrollmentRepo.find(new Uuid(input.id));
        
        if (!enrollment) {
            throw new CustomNotFoundError(input.id, Enrollment.name);
        }

        return EnrollmentOutputMapper.toOutput(enrollment);
    }
}

export type FindEnrollmentUseCaseInput = {
    id: string;
}