import { IUseCase } from "@core/@shared/application/use-case-interface";
import UpdateStudentInput from "./input-update-student";
import { StudentOutput, StudentOutputMapper } from "../output/student-output";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { Address } from "@core/student/domain/value-object/address.vo";
import { EntityValidationError } from "@core/@shared/erros/validate.error";

export class UpdateStudentUsecase implements IUseCase<UpdateStudentInput, StudentOutput>{

    constructor(private readonly studentRepo: IStudentRepository) { }

    async execute(input: UpdateStudentInput): Promise<StudentOutput> {
        const studentId = new Uuid(input.id);
        const student = await this.studentRepo.find(studentId);

        if (!student) {
            throw new Error("Student not found");
        }

        student.changeName(input.first_name, input.last_name);

        input.date_of_birth && student.changeBirthday(input.date_of_birth);

        input.phone_number && student.changePhone(input.phone_number);

        if (input.address) {
            const address2 = new Address({
                street: input.address.street,
                number: input.address.number,
                city: input.address.city,
            });
            student.changeAddress(new Address(address2));
        }

        if(student.notifications.hasErrors()){
            throw new EntityValidationError(student.notifications.messages())
        }

        await this.studentRepo.update(student)

        return StudentOutputMapper.toOutput(student);
    }
}