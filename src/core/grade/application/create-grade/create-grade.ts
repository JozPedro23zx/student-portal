import { IUseCase } from "@core/@shared/application/use-case-interface";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import CreateGradeInput from "./input-create-grade";
import { GradeOutput, GradeOutputMapper } from "../output";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Grade } from "@core/grade/domain/grade.entity";
import { Subject } from "@core/grade/domain/value-object/subject.vo";
import { EntityValidationError } from "@core/@shared/erros/validate.error";


export class CreateGradeUsecase implements IUseCase<CreateGradeInput, GradeOutput>{
    constructor(private readonly gradeRepository: IGradeRepository){}

    async execute(input: CreateGradeInput): Promise<GradeOutput> {

        const subject = Subject.create(input.subject);
        const grade = new Grade({
            id: new Uuid(),
            student_id: input.student_id,
            subject: subject,
            exam: input.exam,
            assignment: input.assignment,
            others: input.others,
        });

        grade.validate();
        
        if(grade.notifications.hasErrors()){
            throw new EntityValidationError(grade.notifications.messages())
        }

        await this.gradeRepository.create(grade);

        return GradeOutputMapper.toOutput(grade);
    }
}