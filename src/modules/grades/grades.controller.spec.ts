import { Test, TestingModule } from '@nestjs/testing';
import { GradesController } from './grades.controller';
import { IGradeRepository } from '@core/grade/infrastructure/grade.repository';
import { MyConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { GradesModule } from './grades.module';
import { GradeOutput } from '@core/grade/application/output';
import { CreateGradeUsecase } from '@core/grade/application/create-grade/create-grade';
import { DeleteGradeUsecase } from '@core/grade/application/delete-grade/delete-grade.usecase';
import { FindAllGradesUsecase } from '@core/grade/application/find-grade/find-all-grade.usecase';
import { FindGradeUsecase } from '@core/grade/application/find-grade/find-grade.usecase';
import { UpdateGradeUsecase } from '@core/grade/application/update-grade/update-grade.usecase';
import { Subject } from '@core/grade/domain/value-object/subject.vo';
import { Subjects } from '@core/teacher/domain/value-object/subject.vo';
import { Grade } from '@core/grade/domain/grade.entity';
import { Uuid } from '@core/@shared/domain/value-object/uuid.vo';
import { AuthModule } from '../auth/auth.module';

describe('GradesController', () => {
  let controller: GradesController;
  let repository: IGradeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
          MyConfigModule.forRoot(),
          DatabaseModule,
          GradesModule,
          AuthModule
      ]
  }).compile();

  controller = module.get<GradesController>(GradesController);
  repository = module.get<IGradeRepository>('GradeRepository');
  });

  const createGrade = () => {
    const subject = new Subject(Subjects.MATH);
    const grade = new Grade({
        id: new Uuid(),
        student_id: 'f5ab4ac6-26a2-4ad8-a658-0172f64d7100',
        subject: subject,
        exam: 8,
        assignment: 7,
        others: 9,
    });
    return grade;
};

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUsecase']).toBeInstanceOf(CreateGradeUsecase);
    expect(controller['updateUsecase']).toBeInstanceOf(UpdateGradeUsecase);
    expect(controller['findUsecase']).toBeInstanceOf(FindGradeUsecase);
    expect(controller['findAllUsecase']).toBeInstanceOf(FindAllGradesUsecase);
    expect(controller['deleteUsecase']).toBeInstanceOf(DeleteGradeUsecase);
  });

  it('should call controller to  create a grade', async ()=>{
    const input = {
      student_id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
      subject: "math",
      exam: 8,
      assignment: 7,
      others: 9,
    };

    const expectedOutput: GradeOutput = {
      id: expect.any(String),
      student_id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
      subject: 'math',
      exam: 8,
      assignment: 7,
      others: 9,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }

    const output = await controller.create(input);
    
    expect(output).toStrictEqual(expectedOutput)
  });

  it('should call controller to  find one grade', async ()=>{
    const grade = createGrade();
    await repository.create(grade);

    const expectedOutput: GradeOutput = {
        id: grade.entityId.id,
        student_id: grade.student_id,
        subject: grade.subject.type,
        exam: grade.exam,
        assignment: grade.assignment,
        others: grade.others,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
    }

    const output = await controller.findOne(grade.entityId.id);

    expect(output).toStrictEqual(expectedOutput)
  });

  it('should call controller to  find all grades', async()=>{
    const grades = [createGrade(), createGrade(), createGrade()];

    for (const grade of grades) {
        await repository.create(grade);
    }

    const expectedOutput: GradeOutput[] = grades.map(grade => ({
        id: grade.entityId.id,
        student_id: grade.student_id,
        subject: grade.subject.type,
        exam: grade.exam,
        assignment: grade.assignment,
        others: grade.others,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }));
    

    const output = await controller.findAll();
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to  find some grades', async()=>{
    const grades = [createGrade(), createGrade(), createGrade()];

    for (const grade of grades) {
        await repository.create(grade);
    }

    const gradeIds = [grades[0].entityId.id, grades[2].entityId.id];

    const expectedOutput: GradeOutput[] = [grades[0], grades[2]].map(grade => ({
        id: grade.entityId.id,
        student_id: grade.student_id,
        subject: grade.subject.type,
        exam: grade.exam,
        assignment: grade.assignment,
        others: grade.others,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }));
    

    let output = await controller.findAll(gradeIds);

    output = gradeIds.map(id => output.find(grade => grade.id === id));

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to  update grade', async () => {
    const grade = createGrade();
    await repository.create(grade);

    const updateGradeInput = {id: grade.entityId.id, exam: 9, assignment: 8 };
    
    const expectedOutput: GradeOutput = {
      id: grade.entityId.id,
      student_id: grade.student_id,
      subject: grade.subject.type,
      exam: updateGradeInput.exam,
      assignment: updateGradeInput.assignment,
      others: grade.others,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    const output = await controller.update(updateGradeInput);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to delete grade', async () => {
    const grade = createGrade();
    await repository.create(grade);

    await controller.remove(grade.entityId.id);

    let output = await repository.find(grade.entityId);
    
    expect(output).toBeNull();
  });
});