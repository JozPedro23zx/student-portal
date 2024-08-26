import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from '../teachers.controller';
import { ITeacherRepository } from '@core/teacher/infrastructure/teacher-interface.repository';
import { MyConfigModule } from 'src/modules/config/config.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { TeachersModule } from '../teachers.module';
import { TeacherOutput } from '@core/teacher/application/teacher-output';
import { TeacherFakeBuilder } from '@core/teacher/domain/teacher.fake';
import { Subject } from '@core/teacher/domain/value-object/subject.vo';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RabbitMQModule } from 'src/modules/rabbitmq/rabbitmq.module';

describe('TeachersController', () => {
  let controller: TeachersController;
  let repository: ITeacherRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule.forRoot(), DatabaseModule, TeachersModule, AuthModule, RabbitMQModule]
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
    repository = module.get<ITeacherRepository>('TeacherRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call controller to create a teacher', async ()=>{
    const input = {
        "first_name": "Jon",
        "last_name": "Silver",
        "subject_specialization": ['math', 'science'],
        "date_of_birth": new Date("1999-05-14"), 
        "street": "Flower Street",
        "number": 123,
        "city": "Old York",
        "phone_number": "12345-6789"
    };

    const expectedOutput: TeacherOutput = {
        id: expect.any(String),
        first_name: "Jon",
        last_name: "Silver",
        subject_specialization: ['math', 'science'],
        date_of_birth: input.date_of_birth,
        street: "Flower Street",
        number: 123,
        city: "Old York",
        phone_number: "12345-6789",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
    }

    const output = await controller.create(input);
    
    expect(output).toStrictEqual(expectedOutput);
  })

  it('should call controller to find a teacher', async ()=>{
    const teacher = TeacherFakeBuilder.aTeacher().build();

    await repository.create(teacher);

    const expectedOutput: TeacherOutput = {
        id: teacher.entityId.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        subject_specialization: teacher.subject_specialization.map((s) => s.type),
        date_of_birth: teacher.date_of_birth,
        street: teacher.address.street,
        number: teacher.address.number,
        city: teacher.address.city,
        phone_number: teacher.phone_number,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
    }

    const output = await controller.findOne(teacher.entityId.id)
    
    expect(output).toStrictEqual(expectedOutput);
  })

  it('should call controller to find some teachers', async()=>{
    const teachers = TeacherFakeBuilder.theTeachers(3).build();

    for (const teacher of teachers) {
        await repository.create(teacher);
    }

    const teacherIds = [teachers[0].entityId.id, teachers[2].entityId.id];

    const expectedOutput: TeacherOutput[] = [teachers[0], teachers[2]].map(teacher => ({
        id: teacher.entityId.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        subject_specialization: teacher.subject_specialization.map((s) => s.type),
        date_of_birth: teacher.date_of_birth,
        street: teacher.address.street,
        number: teacher.address.number,
        city: teacher.address.city,
        phone_number: teacher.phone_number,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }));
    

    let output = await controller.findAll(teacherIds);

    output = teacherIds.map(id => output.find(student => student.id === id));

    expect(output).toStrictEqual(expectedOutput);
  })

  it('should call controller to find all teachers', async()=>{
    const teachers = TeacherFakeBuilder.theTeachers(3).build();

    for (const teacher of teachers) {
        await repository.create(teacher);
    }

    const expectedOutput: TeacherOutput[] = teachers.map(teacher => ({
        id: teacher.entityId.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        subject_specialization: teacher.subject_specialization.map((s) => s.type),
        date_of_birth: teacher.date_of_birth,
        street: teacher.address.street,
        number: teacher.address.number,
        city: teacher.address.city,
        phone_number: teacher.phone_number,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }));
    

    let output = await controller.findAll();
    expect(output).toStrictEqual(expectedOutput);
  })


  it('should call controller to update a teacher', async()=>{
    const teacher = TeacherFakeBuilder.aTeacher().withSubjectSpecialization([Subject.create("math")]).build();

    await repository.create(teacher);

    const updateStudentInput = {id: teacher.entityId.id, first_name: 'Updated First Name', last_name: 'Updated Last Name', subject_to_add: "science"};

    const expectedOutput: TeacherOutput = {
      id: teacher.entityId.id,
      first_name: updateStudentInput.first_name,
      last_name: updateStudentInput.last_name,
      subject_specialization: [
        ...teacher.subject_specialization.map((s) => s.type),
        updateStudentInput.subject_to_add
      ],
      date_of_birth: teacher.date_of_birth,
      street: teacher.address.street,
      number: teacher.address.number,
      city: teacher.address.city,
      phone_number: teacher.phone_number,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }  

    const output = await controller.update(updateStudentInput)

    expect(output).toStrictEqual(expectedOutput)
  })

  it('should call controller to delete a teacher', async()=>{
    const teacher = TeacherFakeBuilder.aTeacher().withSubjectSpecialization([Subject.create("math")]).build();

    await repository.create(teacher);

    await controller.remove(teacher.entityId.id);

    let output = await repository.find(teacher.entityId);
        
    expect(output).toBeNull();
  })
  
  
});
