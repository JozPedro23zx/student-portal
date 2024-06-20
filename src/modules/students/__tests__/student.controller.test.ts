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
import { StudentOutput } from "@core/student/application/output/student-output";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

describe("Student Controller integration tests", ()=>{
    let controller: StudentsController;
    let repository: IStudentRepository;
    let createUsecase: CreateStudentUsecase;
    let findUsecase: FindStudentUsecase;
    let findAllUsecase: FindAllStudentUsecase;
    let deleteUsecase: DeleteStudentUsecase;
    let updateUsecase: UpdateStudentUsecase;

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
        createUsecase = module.get<CreateStudentUsecase>(CreateStudentUsecase);
        findUsecase = module.get<FindStudentUsecase>(FindStudentUsecase);
        findAllUsecase = module.get<FindAllStudentUsecase>(FindAllStudentUsecase);
        updateUsecase = module.get<UpdateStudentUsecase>(UpdateStudentUsecase);
        deleteUsecase = module.get<DeleteStudentUsecase>(DeleteStudentUsecase);        
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(createUsecase).toBeDefined();
        expect(findUsecase).toBeDefined();
        expect(findAllUsecase).toBeDefined();
        expect(updateUsecase).toBeDefined();
        expect(deleteUsecase).toBeDefined();
    });

    it('should create a student', async ()=>{
        const input = {
            "first_name": "Jon",
            "last_name": "Silver",
            "date_of_birth": new Date("1999-05-14"), 
            "street": "Flower Street",
            "number": 123,
            "city": "Old York",
            "phone_number": "12345-6789"
        };

        await controller.create(input);
        
        expect(createUsecase.execute).toHaveBeenCalledWith(input);
    })

    it('should find one student', async ()=>{
        const id = "1"
        await controller.findOne(id);
        expect(findUsecase.execute).toHaveBeenCalledWith(id)
    })

    it('should find all students', async()=>{
        await controller.findAll();
        expect(findAllUsecase.execute()).toHaveBeenCalled
    })

    it('should find some students', async()=>{
        const ids = ["1", "2"];
        await controller.findAll(ids);
        expect(findAllUsecase.execute()).toHaveBeenCalledWith({ ids });
    })

    it('should call updateUsecase.execute with correct values', async () => {
        const id = '1';
        const updateStudentDto = { 
            "id": id,
            "first_name": "Jon",
            "last_name": "Silver",
            "date_of_birth": new Date("1999-05-14"), 
            "address": {
                "street": "Flower Street",
                "number": 123,
                "city": "Old York",
            },
            "phone_number": "12345-6789"
         };
        await controller.update(id, updateStudentDto);
        expect(updateUsecase.execute).toHaveBeenCalledWith({ ...updateStudentDto, id });
    });

    it('should call deleteUsecase.execute with correct values', async () => {
        const id = '1';
        await controller.remove(id);
        expect(deleteUsecase.execute).toHaveBeenCalledWith({ id });
    });
})