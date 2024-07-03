import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";

export type DeleteGradeUsecaseInput = {
    id: string;
};

export class DeleteGradeUsecase implements IUseCase<DeleteGradeUsecaseInput, void> {
    constructor(private readonly gradeRepo: IGradeRepository){}

    async execute(input: DeleteGradeUsecaseInput): Promise<void> {
        await this.gradeRepo.delete(new Uuid(input.id));
    }
}