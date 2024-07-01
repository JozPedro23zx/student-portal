import { IEnrollmentRepository } from "../enrollment-interface.repository";
import { InMemoryRepository } from "@core/@shared/infrastructure/repository/in-memory/memory.repository";
import { Enrollment } from "@core/enrollment/domain/enrollment";

export class EnrollmentInMemoryRepository extends InMemoryRepository<Enrollment> implements IEnrollmentRepository {}