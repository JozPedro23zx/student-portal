import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DomainValidationFilter } from 'src/modules/@shared/filters/domain-validation/domain-validation.filter';
import { NotFoundFilter } from 'src/modules/@shared/filters/not-found/not-found.filter';
import CreateStudentInput, { CreateStudentInputProps } from '@core/student/application/create-student/input-create-student';
import { IStudentRepository } from '@core/student/infrastructure/student-interface.repository';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';

describe('StudentsController (e2e)', () => {
  
  let app: INestApplication;
  let repository: IStudentRepository;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    
    app = moduleFixture.createNestApplication();

    const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
    
    await sequelize.sync({ force: true });

    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        transform: true,
      }),
    );
  
    app.useGlobalFilters(
      new DomainValidationFilter(),
      new NotFoundFilter()
    )

    await app.init();

    repository = app.get<IStudentRepository>('StudentRepository');
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('/students (POST)', ()=>{
    it('should return a error 422 (invalid request body)', () => {
      const createStudentInput = {
        name: 'Test Student',
        age: 21,
        course: 'Computer Science',
      };
  
      return request(app.getHttpServer())
        .post('/students')
        .send(createStudentInput)
        .expect(422)
    });

    it('should return a error 422 (entity validation error)', () => {
      const createStudentInput = {
        "first_name": "Jon",
        "last_name": "Silver",
        "date_of_birth": new Date("2015-05-14"), // Invalid date will emit error
        "street": "Flower Street",
        "number": 123,
        "city": "Old York",
        "phone_number": "12345-6789"
    };

    return request(app.getHttpServer())
      .post('/students')
      .send(createStudentInput)
      .expect(422)
    })

    it('should return 201 (success to create stdent)', () => {
      const createStudentInput = {
        "first_name": "Jon",
        "last_name": "Silver",
        "date_of_birth": new Date("1999-05-14"), 
        "street": "Flower Street",
        "number": 123,
        "city": "Old York",
        "phone_number": "12345-6789"
    };

    return request(app.getHttpServer())
      .post('/students')
      .send(createStudentInput)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
    })
  })
});
