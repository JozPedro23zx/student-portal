import { IUseCase } from "@core/@shared/application/use-case-interface";
import { EnrollmentOutput, EnrollmentOutputMapper } from "../enrollment-output";
import { EnrollmentSequelizeRepository } from "@core/enrollment/infrastructure/sequelize/enrollment-sequelize.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Enrollment } from "@core/enrollment/domain/enrollment";
import { EnrollmentStatus } from "@core/enrollment/domain/value-object/enrollmentStatus";

export class UpdateEnrollmentUsecase implements IUseCase<UpdateEnrollmentInput, EnrollmentOutput>{
    constructor(private enrollmentRepository: EnrollmentSequelizeRepository) {}

    async execute(input: UpdateEnrollmentInput): Promise<EnrollmentOutput> {
        const enrollment = await this.enrollmentRepository.find(new Uuid(input.id));

        if(!enrollment){
            throw new CustomNotFoundError(input.id, Enrollment.name);
        }

        const status = EnrollmentStatus.create(input.status);

        enrollment.updateStatus(status);

        await this.enrollmentRepository.update(enrollment);

        return EnrollmentOutputMapper.toOutput(enrollment);
    }
}

export type UpdateEnrollmentInput = {
    id: string,
    status: string
}