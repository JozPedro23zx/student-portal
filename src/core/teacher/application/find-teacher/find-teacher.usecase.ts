import { IUseCase } from "@core/@shared/application/use-case-interface";
import { TeacherOutput, TeacherOutputMapper } from "../teacher-output";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";

export class FindTeacherUsecase implements IUseCase<FindTeacherUsecaseInput, TeacherOutput>{
    constructor(private readonly teacherRepo: ITeacherRepository){}

    async execute(input: FindTeacherUsecaseInput): Promise<TeacherOutput> {
        const teacher = await this.teacherRepo.find(new Uuid(input.id));
        
        if (!teacher) {
            throw new CustomNotFoundError(input.id, "Teacher");
        }

        return TeacherOutputMapper.toOutput(teacher);
    }
}

export type FindTeacherUsecaseInput = {
    id: string
}