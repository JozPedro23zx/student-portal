import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Grade } from "@core/grade/domain/grade.entity";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import { GradeOutput, GradeOutputMapper } from "../output";

export type FindAllGradesUsecaseInput = {
    ids?: string[];
};

export class FindAllGradesUsecase implements IUseCase<FindAllGradesUsecaseInput, GradeOutput[]> {
    constructor(private readonly gradeRepository: IGradeRepository){}

    async execute(input?: FindAllGradesUsecaseInput): Promise<GradeOutput[]> {
        let grades: Grade[];

        if (!input || !Array.isArray(input.ids)) {
            grades = await this.gradeRepository.findAll();
        } else {
            const uuids = input.ids.map((id) => new Uuid(id));
            grades = await this.gradeRepository.findByIds(uuids);
        }

        if (grades.length === 0) {
            throw new CustomNotFoundError(input.ids ? input.ids.join(', ') : '', 'Grade');
        }

        return grades.map((grade) => GradeOutputMapper.toOutput(grade));
    }
}