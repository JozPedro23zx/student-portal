import { IUseCase } from "@core/@shared/application/use-case-interface";
import { StudentOutput, StudentOutputMapper } from "../output/student-output";
import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export class FindStudentUsecase implements IUseCase<FindStudentUsecaseInput, StudentOutput>{
    constructor(private readonly studentRepo: IStudentRepository){}

    async execute(input: FindStudentUsecaseInput): Promise<StudentOutput> {
        const student = await this.studentRepo.find(new Uuid(input.id));
        
        if (!student) {
            throw new Error("Student Not Found");
        }

        return StudentOutputMapper.toOutput(student);
    }
}

type FindStudentUsecaseInput = {
    id: string
}