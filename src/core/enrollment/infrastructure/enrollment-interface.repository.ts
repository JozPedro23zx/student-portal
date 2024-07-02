import { IRepository } from "@core/@shared/infrastructure/repository/repository-interface";
import { Enrollment } from "../domain/enrollment";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export interface IEnrollmentRepository extends IRepository<Enrollment>{
    findByClassRoom(id: Uuid): Promise<Enrollment[]>;
    findByStudent(id: Uuid): Promise<Enrollment>;
}