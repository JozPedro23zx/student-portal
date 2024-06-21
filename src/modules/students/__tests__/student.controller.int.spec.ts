import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { StudentsController } from "../students.controller"
import { TestingModule, Test} from "@nestjs/testing"
import { DatabaseModule } from "src/modules/database/database.module";
import { StudentsModule } from "../students.module";
import { CreateStudentUsecase } from "@core/student/application/create-student/create-student.usecase";
import { UpdateStudentUsecase } from "@core/student/application/update-student/update-student.usecase";
import { DeleteStudentUsecase } from "@core/student/application/delete-student/delete-student";
import { FindStudentUsecase } from "@core/student/application/find-student/find-student.usecase";
import { FindAllStudentUsecase } from "@core/student/application/find-student/find-all-students.usecase";
import { MyConfigModule } from "src/modules/config/config.module";
import { StudentOutput } from "@core/student/application/output/student-output";
import { StudentFakeBuilder } from "@core/student/domain/student.fake";
import { Student } from "@core/student/domain/student.entity";

describe("Student Controller integration tests", ()=>{
    let controller: StudentsController;
    let repository: IStudentRepository;

    beforeEach(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MyConfigModule.forRoot(),
                DatabaseModule,
                StudentsModule,
            ]
        }).compile();

        controller = module.get<StudentsController>(StudentsController);
        repository = module.get<IStudentRepository>('StudentRepository');
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(controller['createUsecase']).toBeInstanceOf(CreateStudentUsecase);
        expect(controller['updateUsecase']).toBeInstanceOf(UpdateStudentUsecase);
        expect(controller['findUsecase']).toBeInstanceOf(FindStudentUsecase);
        expect(controller['findAllUsecase']).toBeInstanceOf(FindAllStudentUsecase);
        expect(controller['deleteUsecase']).toBeInstanceOf(DeleteStudentUsecase);
    });

    it('should call controller to  create a student', async ()=>{
        const input = {
            "first_name": "Jon",
            "last_name": "Silver",
            "date_of_birth": new Date("1999-05-14"), 
            "street": "Flower Street",
            "number": 123,
            "city": "Old York",
            "phone_number": "12345-6789"
        };

        const expectedOutput: StudentOutput = {
            id: expect.any(String),
            first_name: "Jon",
            last_name: "Silver",
            date_of_birth: input.date_of_birth,
            street: "Flower Street",
            number: 123,
            city: "Old York",
            phone_number: "12345-6789",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        }

        const output = await controller.create(input);
        
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should call controller to  find one student', async ()=>{
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);

        const expectedOutput: StudentOutput = {
            id: student.entityId.id,
            first_name: student.first_name,
            last_name: student.last_name,
            date_of_birth: student.date_of_birth,
            street: student.address.street,
            number: student.address.number,
            city: student.address.city,
            phone_number: student.phone_number,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        }

        const output = await controller.findOne(student.entityId.id);

        expect(output).toStrictEqual(expectedOutput)
    })

    it('should call controller to  find all students', async()=>{
        const students = StudentFakeBuilder.theStudents(3).build() as Student[];

        for (const student of students) {
            await repository.create(student);
        }

        const expectedOutput: StudentOutput[] = students.map(student => ({
            id: student.entityId.id,
            first_name: student.first_name,
            last_name: student.last_name,
            date_of_birth: student.date_of_birth,
            street: student.address.street,
            number: student.address.number,
            city: student.address.city,
            phone_number: student.phone_number,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }));
        

        const output = await controller.findAll();
        expect(output).toStrictEqual(expectedOutput);
    })

    it('should call controller to  find some students', async()=>{
        const students = StudentFakeBuilder.theStudents(3).build() as Student[];

        for (const student of students) {
            await repository.create(student);
        }

        const studentIds = [students[0].entityId.id, students[2].entityId.id];

        const expectedOutput: StudentOutput[] = [students[0], students[2]].map(student => ({
            id: student.entityId.id,
            first_name: student.first_name,
            last_name: student.last_name,
            date_of_birth: student.date_of_birth,
            street: student.address.street,
            number: student.address.number,
            city: student.address.city,
            phone_number: student.phone_number,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }));
        

        let output = await controller.findAll(studentIds);

        output = studentIds.map(id => output.find(student => student.id === id));

        expect(output).toStrictEqual(expectedOutput);
    })

    it('should call controller to  update student', async () => {
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);

        const updateStudentInput = {id: student.entityId.id, first_name: 'Updated First Name', last_name: 'Updated Last Name' };
        
        const expectedOutput: StudentOutput = {
          id: student.entityId.id,
          first_name: updateStudentInput.first_name,
          last_name: updateStudentInput.last_name,
          date_of_birth: student.date_of_birth,
          street: student.address.street,
          number: student.address.number,
          city: student.address.city,
          phone_number: student.phone_number,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        };
  
        const output = await controller.update(updateStudentInput);
  
        expect(output).toStrictEqual(expectedOutput);
      });

    it('should call controller to delete student', async () => {
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);

        await controller.remove(student.entityId.id);

        let output = await repository.find(student.entityId);
        
        expect(output).toBeNull();
    });
})