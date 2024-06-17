import { IUseCase } from "@core/@shared/application/use-case-interface";
import CreateStudentInput from "./input-create-student";
import { StudentOutput, StudentOutputMapper } from "../output/student-output";
import { Address } from "@core/student/domain/value-object/address.vo";
import { Student } from "@core/student/domain/student.entity";
import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";

export class CreateStudentUsecase implements IUseCase<CreateStudentInput, StudentOutput>{

    constructor(private readonly studentRepo: IStudentRepository){}

    async execute(input: CreateStudentInput): Promise<StudentOutput> {
        const inputAddress =  new Address({
            street: input.street,
            number: input.number,
            city: input.city
        });

        const student = new Student({
            first_name: input.first_name,
            last_name: input.last_name,
            date_of_birth: input.date_of_birth,
            address: inputAddress,
        });

        student.validate();

        if(student.notifications.hasErrors()){
            throw new Error(student.notifications.getErrors())
        }

        if (input.phone_number) student.changePhone(input.phone_number);

        await this.studentRepo.create(student);

        return StudentOutputMapper.toOutput(student);
    }
}