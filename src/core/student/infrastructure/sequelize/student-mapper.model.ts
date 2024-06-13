import { Student } from "@core/student/domain/student.entity";
import { StudentModel } from "./student.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { first } from "rxjs";
import { Address } from "@core/student/domain/value-object/address.vo";

export class StudentMapperModel{
    static toModel(entity: Student): StudentModel{
        return StudentModel.build({
            id: entity.entityId.id,
            first_name: entity.first_name,
            last_name: entity.last_name,
            date_of_birth: entity.date_of_birth,
            street: entity.address.street,
            number: entity.address.number,
            city: entity.address.city,
            phone_number: entity.phone_number,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        })
    }

    static toEntity(model: StudentModel): Student{
        const studentAddress = new Address({
            street: model.street,
            number: model.number,
            city: model.city
        });

        const student = new Student({
            id: new Uuid(model.id),
            first_name: model.first_name,
            last_name: model.last_name,
            date_of_birth: model.date_of_birth,
            address: studentAddress,
            phone_number: model.phone_number,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        });

        student.validate();

        return student
    }
}