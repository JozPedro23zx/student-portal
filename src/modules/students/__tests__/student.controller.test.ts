import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { StudentsController } from "../students.controller"
import { TestingModule, Test} from "@nestjs/testing"
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/modules/database/database.module";
import { StudentsModule } from "../students.module";
import { CreateStudentUsecase } from "@core/student/application/create-student/create-student.usecase";
import { UpdateStudentUsecase } from "@core/student/application/update-student/update-student.usecase";
import { DeleteStudentUsecase } from "@core/student/application/delete-student/delete-student";
import { FindStudentUsecase } from "@core/student/application/find-student/find-student.usecase";
import { FindAllStudentUsecase } from "@core/student/application/find-student/find-all-students.usecase";

describe("Student Controller integration tests", ()=>{
    let controller: StudentsController;
    let repository: IStudentRepository;

    beforeEach(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                DatabaseModule,
                StudentsModule,
            ]
        }).compile();

        controller = module.get<StudentsController>(StudentsController);
        repository = module.get<IStudentRepository>('StudentRepository');
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(CreateStudentUsecase);
        expect(controller['updateUseCase']).toBeInstanceOf(UpdateStudentUsecase);
        expect(controller['findUsecase']).toBeInstanceOf(FindStudentUsecase);
        expect(controller['findAllUsecase']).toBeInstanceOf(FindAllStudentUsecase);
        expect(controller['deleteUseCase']).toBeInstanceOf(DeleteStudentUsecase);
      });
})