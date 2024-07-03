import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import { GradeOutput, GradeOutputMapper } from "../output";

export type FindGradeUsecaseInput = {
    id: string;
};

export class FindGradeUsecase implements IUseCase<FindGradeUsecaseInput, GradeOutput> {
    constructor(private readonly gradeRepository: IGradeRepository){}

    async execute(input: FindGradeUsecaseInput): Promise<GradeOutput> {
        const grade = await this.gradeRepository.find(new Uuid(input.id));

        if (!grade) {
            throw new CustomNotFoundError(input.id, 'Grade');
        }

        return GradeOutputMapper.toOutput(grade);
    }
}