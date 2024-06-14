import { Student } from "@core/student/domain/student.entity";

export type StudentOutput = {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    street: string;
    number: number;
    city: string;
    phone_number: string;
    createdAt: Date;
    updatedAt: Date;
}

export class StudentOutputMapper {
    static toOutput(entity: Student): StudentOutput{
        return {
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
        }
    }
}