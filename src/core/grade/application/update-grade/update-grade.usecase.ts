import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EntityValidationError } from "@core/@shared/erros/validate.error";
import { Grade } from "@core/grade/domain/grade.entity";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import { GradeOutput, GradeOutputMapper } from "../output";
import UpdateGradeInput from "./input-update-grade.usecase";

export class UpdateGradeUsecase implements IUseCase<UpdateGradeInput, GradeOutput>{
    constructor(private readonly gradeRepository: IGradeRepository){}

    async execute(input: UpdateGradeInput): Promise<GradeOutput> {
        const gradeId = new Uuid(input.id);
        const grade = await this.gradeRepository.find(gradeId);

        if (!grade) {
            throw new CustomNotFoundError(gradeId.id, Grade.name);
        }

        if (input.exam !== undefined) {
            grade.manageExamGrade(input.exam);
        }

        if (input.assignment !== undefined) {
            grade.manageAssignmentGrade(input.assignment);
        }

        if (input.others !== undefined) {
            grade.manageOthersGrade(input.others);
        }

        if (grade.notifications.hasErrors()) {
            throw new EntityValidationError(grade.notifications.messages());
        }

        await this.gradeRepository.update(grade);

        return GradeOutputMapper.toOutput(grade);
    }
}