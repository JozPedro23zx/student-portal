import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import { GradeOutput, GradeOutputMapper } from "../output";

export type FindGradeUsecaseInput = {
    id: string;
};

export class FindGradeByStudentUsecase implements IUseCase<FindGradeUsecaseInput, GradeOutput[]> {
    constructor(private readonly gradeRepository: IGradeRepository){}

    async execute(input: FindGradeUsecaseInput): Promise<GradeOutput[]> {
        const grades = await this.gradeRepository.findByStudent(new Uuid(input.id));

        if (grades.length === 0) {
            throw new CustomNotFoundError(`student:${input.id}` , 'Grade');
        }

        return grades.map((grade) => GradeOutputMapper.toOutput(grade));
    }
}