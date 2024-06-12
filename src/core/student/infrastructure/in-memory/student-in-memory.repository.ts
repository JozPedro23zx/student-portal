import { InMemoryRepository } from "@core/@shared/infrastructure/in-memory/memory.repository";
import { Student } from "@core/student/domain/student.entity";
import { IStudentRepository } from "../student-interface.repository";

export class StudentRepositoryInMemory extends InMemoryRepository<Student> implements IStudentRepository{}