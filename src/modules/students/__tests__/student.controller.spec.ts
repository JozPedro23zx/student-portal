import { StudentsController } from "../students.controller"
import { TestingModule, Test} from "@nestjs/testing"
import { CreateStudentUsecase } from "@core/student/application/create-student/create-student.usecase";
import { UpdateStudentUsecase } from "@core/student/application/update-student/update-student.usecase";
import { DeleteStudentUsecase } from "@core/student/application/delete-student/delete-student";
import { FindStudentUsecase } from "@core/student/application/find-student/find-student.usecase";
import { FindAllStudentUsecase } from "@core/student/application/find-student/find-all-students.usecase";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { JwtService } from "@nestjs/jwt";


describe("Student Controller unit tests", ()=>{
    let controller: StudentsController;
    let createUsecase: CreateStudentUsecase;
    let findUsecase: FindStudentUsecase;
    let findAllUsecase: FindAllStudentUsecase;
    let deleteUsecase: DeleteStudentUsecase;
    let updateUsecase: UpdateStudentUsecase;

    const mockAuthGuard = {
      canActivate: jest.fn(() => true),
    };
  
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [StudentsController],
          providers: [
            {
              provide: CreateStudentUsecase,
              useValue: { execute: jest.fn() },
            },
            {
              provide: FindStudentUsecase,
              useValue: { execute: jest.fn() },
            },
            {
              provide: FindAllStudentUsecase,
              useValue: { execute: jest.fn() },
            },
            {
              provide: UpdateStudentUsecase,
              useValue: { execute: jest.fn() },
            },
            {
              provide: DeleteStudentUsecase,
              useValue: { execute: jest.fn() },
            },
            {
              provide: AuthGuard,
              useValue: mockAuthGuard,
            },
            {
              provide: JwtService,
              useValue: mockAuthService,
            },
          ],
        }).compile();
    
        controller = module.get<StudentsController>(StudentsController);
        createUsecase = module.get<CreateStudentUsecase>(CreateStudentUsecase);
        findUsecase = module.get<FindStudentUsecase>(FindStudentUsecase);
        findAllUsecase = module.get<FindAllStudentUsecase>(FindAllStudentUsecase);
        updateUsecase = module.get<UpdateStudentUsecase>(UpdateStudentUsecase);
        deleteUsecase = module.get<DeleteStudentUsecase>(DeleteStudentUsecase);
      });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call createUsecase.execute with correct values', async ()=>{
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

    it('should call findUsecase.execute with correct values', async ()=>{
        const id = "1"
        await controller.findOne(id);
        expect(findUsecase.execute).toHaveBeenCalledWith({id})
    })

    it('should call findAllUsecase.execute', async()=>{
        await controller.findAll();
        expect(findAllUsecase.execute).toHaveBeenCalled
    })

    it('should call findAllUsecase.execute with correct values', async()=>{
        const ids = ["1", "2"];
        await controller.findAll(ids);
        expect(findAllUsecase.execute).toHaveBeenCalledWith({ ids });
    })

    it('should call updateUsecase.execute with correct values', async () => {
        const updateStudentDto = { 
            "id": "123",
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
        await controller.update(updateStudentDto);
        expect(updateUsecase.execute).toHaveBeenCalledWith({ ...updateStudentDto});
    });

    it('should call deleteUsecase.execute with correct values', async () => {
        const id = '1';
        await controller.remove(id);
        expect(deleteUsecase.execute).toHaveBeenCalledWith({ id });
    });
})