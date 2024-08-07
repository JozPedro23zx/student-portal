import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DomainValidationFilter } from 'src/modules/@shared/filters/domain-validation/domain-validation.filter';
import { NotFoundFilter } from 'src/modules/@shared/filters/not-found/not-found.filter';
import { IStudentRepository } from '@core/student/infrastructure/student-interface.repository';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';
import { StudentFakeBuilder } from '@core/student/domain/student.fake';
import UpdateStudentInput from '@core/student/application/update-student/input-update-student';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';

describe('StudentsController (e2e)', () => {

  let app: INestApplication;
  let sequelize: Sequelize;
  let repository: IStudentRepository;

  let authService: AuthService;
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

    authService = moduleFixture.get<AuthService>(AuthService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    const payload = {
      email: "admin@admin",
      name: 'test',
      realm_access: {
        roles: ['admin']
      }
    };

    token = jwtService.sign(payload);

    sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
    repository = app.get<IStudentRepository>('StudentRepository');
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await app.close();
  });

  describe('/students (POST)', () => {
    it('should return a error 422 (invalid request body)', () => {
      const createStudentInput = {
        name: 'Test Student',
        age: 21,
        course: 'Computer Science',
      };

      return request(app.getHttpServer())
        .post('/students')

        .set('Authorization', `Bearer ${token}`).send(createStudentInput)
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
        .set('Authorization', `Bearer ${token}`)
        .send(createStudentInput)
        .expect(422)
    })

    it('should return 201 (success to create stdent)', () => {
      const createStudentInput = {
        "first_name": "Jon",
        "last_name": "Silver",
        "date_of_birth": "1999-05-14",
        "street": "Flower Street",
        "number": 123,
        "city": "Old York",
        "phone_number": "12345-6789"
      };

      return request(app.getHttpServer())
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send(createStudentInput)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    })
  })

  describe('/students (GET)', () => {
    it('should emit not found error', () => {
      const id = "2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b"
      return request(app.getHttpServer())
        .get(`/students/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })


    it('should return a student', async () => {
      const student = StudentFakeBuilder.aStudent().build();
      await repository.create(student);

      return request(app.getHttpServer())
        .get(`/students/${student.entityId.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })

  describe('/students (PATCH)', () => {
    it('should emit not found error', () => {
      const input: UpdateStudentInput = {
        id: "2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b",
        first_name: "Alex"
      }
      return request(app.getHttpServer())
        .patch(`/students`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)
        .expect(404)
    })

    it('should update student', async () => {
      const student = StudentFakeBuilder.aStudent().build();
      await repository.create(student);

      const input: UpdateStudentInput = {
        id: student.entityId.id,
        first_name: "Alex"
      }
      return request(app.getHttpServer())
        .patch(`/students`)
        .set('Authorization', `Bearer ${token}`)
        .send(input)
        .expect(200)
        .expect((res) => {
          expect(res.body.first_name).toBe(input.first_name);
        })
    })
  })

  describe('/students (DELETE)', () => {
    it('should emit not found error', () => {
      const id = "2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b"
      return request(app.getHttpServer())
        .delete(`/students/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    it('should delete student', async () => {
      const student = StudentFakeBuilder.aStudent().build();
      await repository.create(student);

      repository.find(student.entityId)

      return request(app.getHttpServer())
        .delete(`/students/${student.entityId.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(async (res) => {
          await expect(repository.find(student.entityId)).resolves.toBeNull()
        })
    })
  })

});
