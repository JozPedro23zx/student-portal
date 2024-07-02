import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { IEnrollmentRepository } from "@core/enrollment/infrastructure/enrollment-interface.repository";


export class DeleteEnrollmentUseCase implements IUseCase<DeleteEnrollmentInput, void>{
    constructor(private enrollmentRepository: IEnrollmentRepository) {}

    async execute(input: DeleteEnrollmentInput): Promise<void> {
        const uuid = new Uuid(input.id);
        await this.enrollmentRepository.delete(uuid);
    }
}

export type DeleteEnrollmentInput = {
    id: string
}