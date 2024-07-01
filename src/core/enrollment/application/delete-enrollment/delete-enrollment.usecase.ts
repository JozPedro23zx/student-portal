import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { EnrollmentSequelizeRepository } from "@core/enrollment/infrastructure/sequelize/enrollment-sequelize.repository";


export class DeleteEnrollmentUseCase implements IUseCase<DeleteEnrollmentInput, void>{
    constructor(private enrollmentRepository: EnrollmentSequelizeRepository) {}

    async execute(input: DeleteEnrollmentInput): Promise<void> {
        const uuid = new Uuid(input.id);
        await this.enrollmentRepository.delete(uuid);
    }
}

export type DeleteEnrollmentInput = {
    id: string
}