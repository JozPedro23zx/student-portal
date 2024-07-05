import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Grade } from "@core/grade/domain/grade.entity";
import { Subject, Subjects } from "@core/grade/domain/value-object/subject.vo";
import { IGradeRepository } from "@core/grade/infrastructure/grade.repository";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getConnectionToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize";
import { AppModule } from "src/app.module";
import { DomainValidationFilter } from "src/modules/@shared/filters/domain-validation/domain-validation.filter";
import { NotFoundFilter } from "src/modules/@shared/filters/not-found/not-found.filter";
import { AuthService } from "src/modules/auth/auth.service";
import request from 'supertest';

describe('GradesController (e2e)', () => {
    let app: INestApplication;
    let sequelize: Sequelize;
    let repository: IGradeRepository;

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
            roles: ['admin', 'teacher']
        }
      };
  
      token = jwtService.sign(payload);
  
      sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
      repository = app.get<IGradeRepository>('GradeRepository');
    });
  
    beforeEach(async () => {
      await sequelize.sync({ force: true });
    });
  
    afterAll(async () => {
      await app.close();
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
  
    describe('/grades (POST)', () => {
      it('should return a 422 error (invalid request body)', () => {
        const createGradeInput = {
          subject: 'Math',
          exam: 8,
        };
  
        return request(app.getHttpServer())
          .post('/grades')
          .set('Authorization', `Bearer ${token}`)
          .send(createGradeInput)
          .expect(422);
      });

      it('should return a error 422 (entity validation error)', () => {
        const createGradeInput = {
            student_id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
            subject: 'math',
            exam: 8,
            assignment: 12, // Invalid grade will emit error
            others: 9,
          };

            
        return request(app.getHttpServer())
          .post('/grades')
          .set('Authorization', `Bearer ${token}`)
          .send(createGradeInput)
          .expect(422)
      });
  
      it('should return a 201 (success to create grade)', () => {
        const createGradeInput = {
          student_id: 'e96e021a-9fd4-4d75-9f5d-3ce3253dd252',
          subject: 'math',
          exam: 8,
          assignment: 7,
          others: 9,
        };
  
        return request(app.getHttpServer())
          .post('/grades')
          .set('Authorization', `Bearer ${token}`)
          .send(createGradeInput)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
          });
      });
    });
  
    describe('/grades (GET)', () => {
      it('should emit not found error', () => {
        const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
        return request(app.getHttpServer())
          .get(`/grades/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
  
      it('should return a grade', async () => {
        const grade = createGrade();
        await repository.create(grade);
  
        return request(app.getHttpServer())
          .get(`/grades/${grade.entityId.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });
  
    describe('/grades (PATCH)', () => {
      it('should emit not found error', () => {
        const input = {
          id: '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b',
          exam: 9,
        };
        return request(app.getHttpServer())
          .patch(`/grades`)
          .set('Authorization', `Bearer ${token}`)
          .send(input)
          .expect(404);
      });
  
      it('should update grade', async () => {
        const grade = createGrade();
        await repository.create(grade);
  
        const input = {
          id: grade.entityId.id,
          exam: 9,
        };
        return request(app.getHttpServer())
          .patch(`/grades`)
          .set('Authorization', `Bearer ${token}`)
          .send(input)
          .expect(200)
          .expect((res) => {
            expect(res.body.exam).toBe(input.exam);
          });
      });
    });
  
    describe('/grades (DELETE)', () => {
      it('should emit not found error', () => {
        const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
        return request(app.getHttpServer())
          .delete(`/grades/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
  
      it('should delete grade', async () => {
        const grade = createGrade();
        await repository.create(grade);
  
        return request(app.getHttpServer())
          .delete(`/grades/${grade.entityId.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect(async () => {
            await expect(repository.find(grade.entityId)).resolves.toBeNull();
          });
      });
    });
  });